import { ISearch } from "../../interfaces/app/search";
import {IStock } from "../../interfaces/ProdutosInterface";
import { handleMongoError } from "../../util/errors/api-error";
import { Stock } from "../model/Stock";

export default class StockService{
    public static async findAllStock({ limit, page }: ISearch) {
        return new Promise(async function (resolve, reject) {
            try {
                const result = await Stock.find({})
                    .limit(Number(limit))
                    .skip(Number(page))
                    .populate('product', 'serialNumber productCover cover_url model brand condition technicalDescription active technicalDescription isAvailable')
                    .sort({ createdAt: -1 });
                resolve(result);
            } catch (error: unknown) {
                reject(handleMongoError(error));
            }
        });
    }
    public static async findOneStock(stockId: string) {
        return new Promise(async function (resolve, reject) {
            try {
                const result = await Stock.findById(stockId)
                    .populate('product', 'serialNumber productCover cover_url model brand condition technicalDescription active technicalDescription isAvailable')
                    .sort({ createdAt: -1 });
                resolve(result);
            } catch (error: unknown) {
                reject(handleMongoError(error));
            }
        });
    }
    public static async findExisteProduct(productId: string) {
        return new Promise(async function (resolve, reject) {
            try {
                const result = await Stock.findOne({product: productId})
                    .populate('product', 'serialNumber productCover cover_url model brand condition technicalDescription active technicalDescription isAvailable')
                    .sort({ createdAt: -1 });
                resolve(result);
            } catch (error: unknown) {
                reject(handleMongoError(error));
            }
        });
    }
    public static async saveStock(stock: IStock) {
        return new Promise(async function (resolve, reject) {
            try {
                const result = await Stock.create(stock);
                resolve(result);
            } catch (error: unknown) {
                reject(handleMongoError(error));
            }
        });
    }
    public static async updateStock(stockId: string, stock: IStock) {
        return new Promise(async function (resolve, reject) {
            try {
                const result = await Stock.findByIdAndUpdate(
                    { _id: stockId },
                    { $set: stock },
                    { new: false }
                );
                resolve(result);
            } catch (error: unknown) {
                reject(handleMongoError(error));
            }
        });
    }
    public static async deleteStock(stockId: string) {
        return new Promise(async function (resolve, reject) {
            try {
                const result = await Stock.findByIdAndDelete(stockId);
                resolve(result);
            } catch (error: unknown) {
                reject(handleMongoError(error));
            }
        });
    }
}