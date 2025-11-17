import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  stock: number;
  images: string[];
  category?: string;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true, index: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  images: { type: [String], default: [] },
  category: { type: String, default: '' }
}, { timestamps: true });

export default model<IProduct>('Product', ProductSchema);
