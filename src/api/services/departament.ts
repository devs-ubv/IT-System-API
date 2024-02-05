// eslint-disable-next-line import/no-extraneous-dependencies
import bcrypt from 'bcrypt';
import { Department } from '../model/Departament';
import { IUser, IUserRegister } from '../../interfaces/UserInterface';
import { handleMongoError } from '../../util/errors/api-error';
import { ISearch } from '../../interfaces/app/search';
export default class AuthService {
  public static async findAllDepartament({ limit, page }: ISearch) {
    return new Promise(async function (resolve, reject) {
      try {
        const result = await Department.find({})
          .limit(Number(limit))
          .skip(Number(page))
          .populate('permission', '_id  id role type');
        resolve(result);
      } catch (error: unknown) {
        reject(handleMongoError(error));
      }
    });
  }
  public static async findOneUser(userId: string) {
    return new Promise(async function (resolve, reject) {
      try {
        const result = (await Department.findById(userId).populate(
          'permission',
          '_id  id role type'
        )) as IUser;
        resolve(result);
      } catch (error: unknown) {
        reject(handleMongoError(error));
      }
    });
  }
  public static async saveUser(user: IUserRegister) {
    return new Promise(async function (resolve, reject) {
      console.log(user);
      try {
        const result = await Department.create(user);
        resolve(result);
      } catch (error: unknown) {
        reject(handleMongoError(error));
      }
    });
  }
  public static async updateUser(userId: string, user: IUserRegister) {
    return new Promise(async function (resolve, reject) {
      try {
        const result = await Department.findByIdAndUpdate(
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

  public static async deleteUser(userId: string) {
    return new Promise(async function (resolve, reject) {
      try {
        const result = await Department.findByIdAndDelete(userId);
        resolve(result);
      } catch (error: unknown) {
        reject(handleMongoError(error));
      }
    });
  }
}