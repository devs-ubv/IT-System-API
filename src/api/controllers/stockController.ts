import { Request, Response, raw } from 'express';
import productInStockService from '../services/productInStock';
import { ISearch } from '../../interfaces/app/search';
import { deleteFileInDataBase } from '../../util/deleteFile';
import { IProductInStock } from '../../interfaces/ProdutosInterface';
import { fetchAllDataProductStock, responseDataProductStock } from '../../util/dataFetching/productStock';

class StockController {
  public async listAllProductInStock(req: Request, res: Response): Promise<void> {
    const { limit = 25, page = 0 } = req.query as unknown as ISearch;
    try {
      const product = (await productInStockService.findAllProductStock({ limit, page })) as IProductInStock[];
     
      const allDataUser = await fetchAllDataProductStock(product);
      const responseData = responseDataProductStock(allDataUser, Number(0));
    
      res.status(200).send(responseData);
    } catch (error) {
      res.status(404).send(error);
    }
  }

  public async listOneProductInStock(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params;
      if (productId) {
        const product = (await productInStockService.findOneProductStock(productId)) as IProductInStock;
        if (product) {
          res.status(200).send(product);
        } else {
          res
            .status(404)
            .send({ message: 'Não foi encontrada nenhuma producto.' });
        }
      }
    } catch (error) {
      res.status(404).send(error);
    }
  }

  public async saveProductInStock(req: Request, res: Response): Promise<void> {
    try {
  
        const inputs = {
          ...req.body,
          invoiceDocument: req.file?.filename
        };
        const data = (await productInStockService.saveProductStock(inputs)) as any;
        res
          .status(201)
          .json({ success: 'Cadastro feito  com sucesso', stockId: data?._id });
      
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error });
    }
  }

  public async updateProductInStock(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params;
      const ProductInStock = (await productInStockService.updateProductStock(productId, req.body)) as IProductInStock;
      res.status(204).json({
        message: 'As suas informações foram actualizadas com sucesso',
        ProductInStock,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Aconteceu um erro ao atualizada', error });
    }
  }

  public async updateProductInStockWithProfile(req: Request, res: Response): Promise<Response> {
    try {
      const {productId } = req.params;

      const inputs = {
        profile: {
          thumbnail: req.file?.filename,
          name: req.file?.originalname,
        },
        ...req.body,
      };
      const ProductInStockFinded = (await productInStockService.findOneProductStock(productId)) as IProductInStock;

      if (ProductInStockFinded) {
        const resultDelete = await deleteFileInDataBase('stock', ProductInStockFinded?.invoiceDocument);
        if (resultDelete) {
          const ProductInStock = (await productInStockService.updateProductStock(productId, inputs)) as any;
          return res.status(204).json({
            message: 'As suas informações foram actualizadas com sucesso',
            ProductInStock,
          });
        }
      }
      return res
        .status(500)
        .json({ message: 'Ocorreu um erro ao atualizar os dados' });

    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Ocorreu um erro ao atualizar os dados', error });
    }

  }

  public async deleteProductInStock(req: Request, res: Response): Promise<Response> {
    try {
      const { productId } = req.params;

      const productInStockFinded = (await productInStockService.findOneProductStock(productId)) as IProductInStock;

      if (productInStockFinded) {
        const resultDelete = await deleteFileInDataBase('stock', productInStockFinded?.invoiceDocument);
        if (resultDelete) {
          const ProductInStock = (await productInStockService.deleteProductStock(productId)) as IProductInStock;;
          return res.status(204).json({
            message: 'As suas informações foram deletadas com sucesso',
            ProductInStock,
          });
        }
      }
      return res
        .status(500)
        .json({ message: 'Aconteceu um erro ao deletar os dados do stock' });
    } catch (error) {
      return res.status(404).send(error);
    }
  }
}

export default new StockController();
