// eslint-disable-next-line import/no-extraneous-dependencies
import bcrypt from 'bcrypt';
import { User } from '../model/User';
import { IUser, IUserRegister } from '../../interfaces/UserInterface';
import { handleMongoError } from '../../util/errors/api-error';
import { ISearch } from '../../interfaces/app/search';
import { Delivery } from '../model/Delivery';
import { IDelivery } from '../../interfaces/ProdutosInterface';
import { Types } from 'mongoose';
export default class AuthService {
  public static async findAllDelivery({ limit, page }: ISearch) {
    return new Promise(async function (resolve, reject) {
      try {
        const result = await Delivery.find({})
          .limit(Number(limit))
          .skip(Number(page))
          .populate({
            path: 'deliveredBy',
            select: 'firstName surname',
            populate: {
              path: 'department',
              select: '-_id departmentName', // Seleciona apenas o campo 'name' do departamento
              populate: {
                path: 'company',
                select: '-_id companyName', // Seleciona apenas os campos 'logo' e 'name' da empresa
              },
            },
          })
          .populate({
            path: 'receivedBy',
            select: '-_id firstName surname',
            populate: {
              path: 'department',
              select: '-_id departmentName', // Seleciona apenas o campo 'name' do departamento
              populate: {
                path: 'company',
                select: '-_id companyName', // Seleciona apenas os campos 'logo' e 'name' da empresa
              },
            },
          })
          .populate({
            path: 'beneficiary',
            select: '-_id firstName surname profile profile_url',
            populate: {
              path: 'department',
              select: '-_id departmentName', // Seleciona apenas o campo 'name' do departamento
              populate: {
                path: 'company',
                select: '-_id thumbnail logo_url companyName', // Seleciona apenas os campos 'logo' e 'name' da empresa
              },
            },
          })
          .populate({
            path: 'product',
            select: 'serialNumber productCover cover_url model brand',
            populate: {
              path: 'category',
              select: '-_id categoryName', // Seleciona apenas o campo 'name' do departamento
            },
          })
          .sort({ createdAt: -1 });
        resolve(result);
      } catch (error: unknown) {
        reject(handleMongoError(error));
      }
    });
  }

  public static async verifyDelivery(productId: string) {
    return new Promise(async function (resolve, reject) {
      try {
        const { ObjectId } = Types;
        const produtId = new ObjectId(productId);
        const result = (await Delivery.findOne({
          product: produtId,
        })) as IDelivery;
        
        resolve(result);
      } catch (error: unknown) {
        reject(handleMongoError(error));
      }
    });
  }

  public static async findOneDelivery(deliveryId: string) {
    return new Promise(async function (resolve, reject) {
      try {
        const result = (await Delivery.findById(deliveryId)) as IDelivery;
        resolve(result);
      } catch (error: unknown) {
        reject(handleMongoError(error));
      }
    });
  }
  public static async saveDelivery(delivery: IDelivery) {
    return new Promise(async function (resolve, reject) {
      try {
        const result = await Delivery.create(delivery);
        resolve(result);
      } catch (error: unknown) {
        reject(handleMongoError(error));
      }
    });
  }
  public static async updateDelivery(userId: string, user: IUserRegister) {
    return new Promise(async function (resolve, reject) {
      try {
        const result = await User.findByIdAndUpdate(
          { _id: userId },
          { $set: user },
          { new: false }
        );
        resolve(result);
      } catch (error: unknown) {
        reject(handleMongoError(error));
      }
    });
  }

  public static async deleteDelivery(deliveryId: string) {
    return new Promise(async function (resolve, reject) {
      try {
        const result = await Delivery.findByIdAndDelete(deliveryId);
        resolve(result);
      } catch (error: unknown) {
        reject(handleMongoError(error));
      }
    });
  }
}
