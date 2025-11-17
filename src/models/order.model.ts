import { Schema, model, Document } from 'mongoose';
import { Types } from 'mongoose';

export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type OrderStatus = 'processing' | 'packed' | 'shipped' | 'delivered';

export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  stripePaymentIntentId?: string;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

const OrderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [OrderItemSchema], required: true },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  orderStatus: { type: String, enum: ['processing','packed','shipped','delivered'], default: 'processing' },
  stripePaymentIntentId: { type: String }
}, { timestamps: true });

export default model<IOrder>('Order', OrderSchema);
