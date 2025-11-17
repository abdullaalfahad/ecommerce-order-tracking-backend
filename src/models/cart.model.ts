import { Schema, model, Document } from 'mongoose';
import { Types } from 'mongoose';

export interface ICartItem {
  product: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface ICart extends Document {
  user: Types.ObjectId;
  items: ICartItem[];
  total: number;
}

const CartItemSchema = new Schema<ICartItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true }
});

const CartSchema = new Schema<ICart>({
  user: { type: Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  items: { type: [CartItemSchema], default: [] },
  total: { type: Number, default: 0 }
}, { timestamps: true });

export default model<ICart>('Cart', CartSchema);
