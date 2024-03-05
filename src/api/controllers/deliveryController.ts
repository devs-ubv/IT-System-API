import { Request, Response } from 'express';
import { Delivery } from '../model/Delivery';
import { IDelivery, IProductInStock } from '../../interfaces/ProdutosInterface';
import {
  responseDatadelivery,
  fetchAllDatadelivery,
} from '../../util/dataFetching/delivery';

import deliveryService from '../services/delivery';

import { ISearch } from '../../interfaces/app/search';
import { ProductInStock } from '../model/Stock';

class deliveryController {
  public async listAllDelivery(req: Request, res: Response): Promise<void> {
    const { limit = 25, page } = req.query as unknown as ISearch;
    try {
      const delivery = (await deliveryService.findAllDelivery({
        limit,
        page,
      })) as IDelivery[];
      const allDataUser = await fetchAllDatadelivery(delivery);
      const responseData = responseDatadelivery(allDataUser, Number(0));

      res.status(200).send(responseData);
    } catch (error) {
      res.status(404).send(error);
    }
  }

  public async listOneDelivery(req: Request, res: Response): Promise<void> {
    try {
      const { deliveryId } = req.params;
      const delivery = (await deliveryService.findOneDelivery(
        deliveryId
      )) as IDelivery;
      if (delivery) {
        res.status(200).send(delivery);
      } else {
        res.status(404).send({ message: 'Não foi encontrada nenhuma pedido.' });
      }
    } catch (error) {
      res.status(404).send(error);
    }
  }

  
  public async saveDelivery(req: Request, res: Response): Promise<void> {
    try {
      const verifyDelivery = await deliveryService.verifyDelivery(req.body.product);
      if (verifyDelivery) {
        res
          .status(409)
          .json({ error: 'Esse pedido já foi feito. Experimente outro' });
      } else {
        
      const deliveryDetails = req.body;
      
      const delivery = (await deliveryService.saveDelivery(
        deliveryDetails
      )) as IDelivery;

      await this.updateStock(deliveryDetails.products);
  
        const datadelivery = {
          deliveryName: delivery.product,
          id: delivery._id,
        };

        res
          .status(201)
          .json({ success: 'Cadastro feito  com sucesso', ...datadelivery });
      }
    } catch (error) {
      res.status(500).send({ message: error });
    }
  }


  public async updateStock(products: IDelivery[]) {
    try {
      for (const productuStock of products) {
        const stockItem = await ProductInStock.findOne({ productId: productuStock.product._id });
        if (!stockItem) {
          throw new Error('Produto não encontrado no estoque.');
        }
        stockItem.product.productQuantity -= productuStock.product.deliveryQuantity;
        await stockItem.save();
      }
    } catch (error) {
      throw new Error('Erro ao atualizar estoque.');
    }
  }

  public async updateDelivery(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      const { deliveryId } = req.params;
      const delivery = await Delivery.findByIdAndUpdate(
        { _id: deliveryId },
        { $set: data },
        { new: false }
      );
      res.status(204).json({
        message: 'As suas informações foram actualizadas com sucesso',
        delivery,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Aconteceu um erro ao atualizada', error });
    }
  }

  public async deleteDelivery(req: Request, res: Response): Promise<Response> {
    try {
      const { deliveryId } = req.params;
      const delivery = await Delivery.findByIdAndDelete(deliveryId);
      if (delivery) {
        return res.status(204).send('Deletado com sucesso');
      }
      return res.status(404).send(delivery);
    } catch (error) {
      return res.status(404).send(error);
    }
  }
}

export default new deliveryController();
