import { Request, Response } from 'express';
import Cart from '../models/cart.model';
import Product from '../models/product.model';
import { Types } from 'mongoose';
import { recalc } from '../utils/cart';


export const addToCart = async (req: Request, res: Response) => {
  const userId = req.user!._id;
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [], total: 0 });
  }

  const idx = cart.items.findIndex((i: any) => i.product.equals(product._id));
  if (idx > -1) {
    const item = cart.items[idx];
    if (item) {
      item.quantity += quantity;
    }
  } else {
    cart.items.push({ product: product._id as Types.ObjectId, quantity, price: product.price });
  }
  recalc(cart);
  await cart.save();
  await cart.populate('items.product');
  res.json(cart);
};

export const getCart = async (req: Request, res: Response) => {
  const userId = req.user!._id;
  let cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [], total: 0 });
  }
  res.json(cart);
};

export const updateCartItem = async (req: Request, res: Response) => {
  const userId = req.user!._id;
  const { productId, quantity } = req.body;
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  const idx = cart.items.findIndex((i: any) => i.product.equals(productId));
  if (idx === -1) return res.status(404).json({ message: 'Item not found' });

  const item = cart.items[idx];
  if (!item) return res.status(404).json({ message: 'Item not found' });

  if (quantity <= 0) cart.items.splice(idx, 1);
  else item.quantity = quantity;

  (cart as any) = recalc(cart);
  await cart.save();
  await cart.populate('items.product');
  res.json(cart);
};

