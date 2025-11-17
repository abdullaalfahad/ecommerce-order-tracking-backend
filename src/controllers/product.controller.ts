import { Request, Response } from 'express';
import Product from '../models/product.model';

export const createProduct = async (req: Request, res: Response) => {
  const data = req.body;
  const p = await Product.create(data);
  res.status(201).json(p);
};

export const listProducts = async (req: Request, res: Response) => {
  const page = parseInt((req.query.page as string) || '0', 10);
  const limit = parseInt((req.query.limit as string) || '12', 10);
  const skip = (page) * limit;
  const [items, total] = await Promise.all([
    Product.find().skip(skip).limit(limit).lean(),
    Product.countDocuments()
  ]);
  res.json({ items, total, page, limit });
};

export const getProduct = async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
};

export const deleteProduct = async (req: Request, res: Response) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(204).end();
};

