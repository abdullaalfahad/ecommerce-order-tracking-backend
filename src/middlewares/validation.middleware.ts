import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

export const validateBody = (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.validate(req.body, { abortEarly: false });
  if (result.error) {
    const message = result.error.details.map(d => d.message).join(', ');
    return res.status(400).json({ message });
  }
  next();
};
