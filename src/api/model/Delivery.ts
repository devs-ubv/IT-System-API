/* eslint-disable import/no-extraneous-dependencies */
import mongoose, { Model, Schema } from 'mongoose';
import { IDelivery } from '../../interfaces/ProdutosInterface';
// eslint-disable-next-line @typescript-eslint/naming-convention

const deliverySchema: Schema = new Schema(
  {
    deliveredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming User model for the one who delivered
    },
    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming User model for the one who received
    },
    beneficiary: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming User model for the beneficiary
    },
    deliveryDate: {
      type: String,
      required: true,
    },
    deliveryQuantity: {
      type: Number,
      required: true,
    },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    additionalAccessorie: [],
    active: Boolean,
    isAvailable: Boolean,
  },
  { timestamps: true }
);

// Export the model and return your IUser interface
export const Delivery: Model<IDelivery> =
  mongoose.models.Delivery || mongoose.model('Delivery', deliverySchema);
