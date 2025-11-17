import { Request, Response } from 'express';
import Product from '../models/product.model';

export const createProduct = async (req: Request, res: Response) => {
  const data = req.body;
  const p = await Product.create(data);
  res.status(201).json(p);
};

