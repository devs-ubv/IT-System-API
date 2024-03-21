// eslint-disable-next-line import/no-extraneous-dependencies
import bcrypt from 'bcrypt';
import { Product } from '../model/Product';
import { handleMongoError } from '../../util/errors/api-error';
import { ISearch } from '../../interfaces/app/search';
import { IProduct } from '../../interfaces/ProdutosInterface';
export default class AuthService {
  public static async findAllProduct({ limit, page }: ISearch) {
    return new Promise(async function (resolve, reject) {
      try {
        const result = await Product.find({})
          .limit(Number(limit))
          .skip(Number(page))
          .populate('registerby', 'profile firstName surname')
          .populate('category', 'categoryName')
          .sort({ createdAt: -1 });
        resolve(result);
      } catch (error: unknown) {
        reject(handleMongoError(error));
      }
    });
  }
  public static async findAllDamagedProducts({ limit, page }: ISearch) {
    return new Promise(async function (resolve, reject) {
      try {
        const result = await Product.find({ condition: 'Danificado'})
          .limit(Number(limit))
          .skip(Number(page))
          .populate('registerby', 'profile firstName surname')
          .populate('category', 'categoryName')
          .sort({ createdAt: -1 });
        resolve(result);
      } catch (error: unknown) {
        reject(handleMongoError(error));
      }
    });
  }
  public static async findOneProduct(userId: string) {
    return new Promise(async function (resolve, reject) {
      try {
        const result = (await Product.findById(userId)
          .populate('category', '_id  categoryName')
          .populate('registerby', 'fullName profile')) as IProduct;
        resolve(result);
      } catch (error: unknown) {
        reject(handleMongoError(error));
      }
    });
  }
  public static async verifyProduct(produtName: string) {
    return new Promise(async function (resolve, reject) {
      try {
        const result = (await Product.findOne({
          produtName: produtName,
        }).populate('category', '_id  categoryName')) as IProduct;
        resolve(result);
      } catch (error: unknown) {
        reject(handleMongoError(error));
      }
    });
  }

  public static async saveProduct(product: IProduct) {
    return new Promise(async function (resolve, reject) {
      try {
        const result = await Product.create(product);
        resolve(result);
      } catch (error: unknown) {
        reject(handleMongoError(error));
      }
    });
  }
  public static async updateProduct(productId: string, product: IProduct) {
    return new Promise(async function (resolve, reject) {
      try {
        const result = await Product.findByIdAndUpdate(
          { _id: productId },
          { $set: product },
          { new: false }
        );
        resolve(result);
      } catch (error: unknown) {
        reject(handleMongoError(error));
      }
    });
  }
  public static async deleteProduct(productId: string) {
    return new Promise(async function (resolve, reject) {
      try {
        const result = await Product.findByIdAndDelete(productId);
        resolve(result);
      } catch (error: unknown) {
        reject(handleMongoError(error));
      }
    });
  }
}
