import dotenv from 'dotenv';
dotenv.config();

import express, { type Application, type Request, type Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import errorMiddleware from './middlewares/error.middleware';
import 'express-async-errors';
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import cartRoutes from './routes/cart.routes';

const app: Application = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || true }));
app.use(morgan('dev'));
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.use("/api", authRoutes);
app.use("/api/products", productRoutes);
app.use('/cart', cartRoutes);

app.use(errorMiddleware);

export default app;
