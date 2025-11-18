import { Request, Response } from 'express';
import User from '../models/user.model';
import { signToken } from '../utils/token';

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'Email already in use' });
  const user = await User.create({ name, email, password });
  const token = signToken({ id: String(user._id), email: user.email, role: user.role });
  res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await user.comparePassword(password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = signToken({ id: String(user._id), email: user.email, role: user.role });
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
};
