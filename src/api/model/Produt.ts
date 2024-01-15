/* eslint-disable import/no-extraneous-dependencies */
import mongoose, { Model, Schema } from 'mongoose';
import { IProdut } from '../../interfaces/ProdutosInterface';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: String,
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // Make sure you have a model for Category
  },
  model: String,
  brand: String,
  specification: String,
  TechnicalDescription: String,
  description: String,
  condition: String,
  sourceOfPurchase: String,
  purchaseDate: Date,
  invoice: String,
  active: Boolean,
  isAvailable: Boolean,
});

// Export the model and return your IUser interface
export const Produt: Model<IProdut> =
  mongoose.models.Produt || mongoose.model('Produt', productSchema);
