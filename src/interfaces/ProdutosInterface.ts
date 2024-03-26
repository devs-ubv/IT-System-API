import { IEmployee, IUser } from './UserInterface';
export interface IProdutoCategory {
  _id: string;
  categoryName: string;
  description: string;
  active: Boolean;
  isAvailable: Boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface IProduct extends Document {
  productQuantity: any;
  productId: any;
  _id: string;
  serialNumber: string;
  cover_url?: string;
  productName: string;
  brand: string;
  productCover: string;
  model: string;
  specification: string;
  technicalDescription: string;
  description: string;
  condition: string;
  sourceOfPurchase: string;
  purchaseDate: string;
  invoice: string;
  status: string;
  category: IProdutoCategory;
  active: boolean;
  isAvailable: string;
  registerby: IUser;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductEntry extends Document {
  _id: string;
  invoiceDocument: string;
  documentNumber: string;
  supplier: string;
  document_url?: string;
  product: IProduct[] & { productQuantity: number }; 
  registerby:IUser
  createdAt: Date;
  updatedAt: Date;
}

export interface IStockProduct{
  serialNumber: string;
  cover_url: string;
  model: string;
  brand: string;
  specification:string;
  technicalDescription: string;
  condition: string;
  active: boolean;
  isAvailable: boolean;
  productQuantity: number;
}

export interface IStock{
  _id?: string;
  product: string;
  productStok?: IProduct;
  productQuantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Imovements{
  productQuantity: number,
  product: string;
  movementDay: string;
  movementTime: string;
  entry: boolean;
  productOutput: boolean;
  delivery?: string;
}


export interface IDeliveryRegister {
  _id: string;
  deliveredBy: IUser;
  receivedBy: IUser;
  beneficiary: IUser;
  product: string ;
  deliveryQuantity: number;
  deliveryDate: Date;
  additionalAccessorie: IAdditionalAccessorie[];
  active: boolean;
  isAvailable: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDelivery {
  _id: string;
  deliveredBy: IUser;
  receivedBy: IUser;
  beneficiary: IUser;
  product: IProduct ;
  deliveryQuantity: number;
  deliveryDate: string;
  additionalAccessorie: IAdditionalAccessorie[];
  active: boolean;
  isAvailable: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdditionalAccessorie {
  name: string;
}

export interface IRequest  {
  _id:string;
  equipment: IProduct;
  requestedBy: IUser;
  employee: IEmployee;
  quantity: number;
  observation: string;
  active:string,
  visible: boolean;
  received:boolean;
  processing:boolean;
  createdAt: Date;
  updatedAt: Date;
}
