import { Request, Response } from 'express';
import { Delivery } from '../model/Delivery';
import { IDelivery, IDeliveryRegister, IProduct, IStock } from '../../interfaces/ProdutosInterface';
import {
  responseDatadelivery,
  fetchAllDatadelivery,
} from '../../util/dataFetching/delivery';
import MovimentService from '../services/moviment';
import { extrairId, getDataFormat, getTimeFormat } from '../../util/functionshelp';
import deliveryService from '../services/delivery';
import StockService from '../services/stock';
import { ISearch } from '../../interfaces/app/search';
import { Stock } from '../model/Stock';

class deliveryController {
  public async listAllDelivery(req: Request, res: Response): Promise<void> {
    const { limit = 25, page } = req.query as unknown as ISearch;
    try {
      // Ordenando os produtos por quantidade (em ordem decrescente)
     

      const delivery = (await deliveryService.findAllDelivery({
        limit,
        page,
      })) as IDelivery[];
      const allDataDelivery= await fetchAllDatadelivery(delivery.sort((a, b) => b.deliveryQuantity - a.deliveryQuantity));
      const responseData = responseDatadelivery(allDataDelivery, Number(0));
    
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
      const deliveryDetails = req.body as IDeliveryRegister;
      const stockData = (await StockService.findExisteProduct(deliveryDetails.productId)) as IStock;
      if (stockData) {
        const totalQuantity = stockData.productQuantity - deliveryDetails.deliveryQuantity;
        const stock = await StockService.updateStock(stockData._id!, { product: deliveryDetails.productId, productQuantity: totalQuantity }) as IStock;
        if (stock) {
          const resultDelivery = await deliveryService.saveDelivery(deliveryDetails);
          await MovimentService.saveMoviment({
            productQuantity: deliveryDetails.deliveryQuantity,
            movementDay: getDataFormat(),
            movementTime: getTimeFormat(),
            entry: false,
            productOutput: true,
            delivery: resultDelivery._id,
            productInStock: deliveryDetails.stockId,
          });

          res
            .status(201)
            .json({ success: 'Cadastro feito  com sucesso', resultDelivery });
        } else {
          res.status(500).json({ message: 'Aconteceu um erro ao atualizada o stock' });
        }
      } else {
        res.status(500).send({ message: 'Não foi encontrado nenhum produto em estoque com esta referencia!' });
      }

    } catch (error) {
      res.status(500).send({ message: error });
    }
  }
  public async updateDelivery(req: Request, res: Response): Promise<void> {
    try {
      const deliveryDetails = req.body as IDeliveryRegister;
      const { deliveryId } = req.params;
      const stockData = (await StockService.findOneStock(deliveryDetails.stockId)) as IStock;
      if (stockData) {
        const totalQuantity = stockData.productQuantity + deliveryDetails.deliveryQuantity;
        const stock = await StockService.updateStock(stockData._id!, { product: deliveryDetails.productId, productQuantity: totalQuantity }) as IStock;
   
        if (stock) {
          const resultDelivery = await deliveryService.deleteDelivery(deliveryId);
          await MovimentService.saveMoviment({
            productQuantity: deliveryDetails.deliveryQuantity,
            movementDay: getDataFormat(),
            movementTime: getTimeFormat(),
            entry: false,
            productOutput: false,
            annulment:true,
            productInStock: deliveryDetails.stockId,
          });
          res.status(200).send(resultDelivery);
        } else {
          res.status(500).json({ message: 'Aconteceu um erro ao atualizada o stock' });
        }
      } else {
        res.status(500).send({ message: 'Não foi encontrado nenhum produto em estoque com esta referencia!' });
      }
    } catch (error) {
      res.status(404).send(error);
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
