import { Request, Response } from 'express';
import Cart from '../models/cart.model';
import Order from '../models/order.model';
import { createPaymentIntent, retrievePaymentIntent } from '../services/stripe.service';

export const createOrderFromCart = async (req: Request, res: Response) => {
  const userId = req.user!._id;
  const cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

  const items = cart.items.map(i => ({
    product: i.product._id,
    quantity: i.quantity,
    price: i.price
  }));
  const totalAmount = cart.total;

  const order = await Order.create({
    user: userId,
    items,
    totalAmount,
    paymentStatus: 'pending',
    orderStatus: 'processing'
  });

  const paymentIntent = await createPaymentIntent(totalAmount, 'usd', { orderId: String(order._id )});

  order.stripePaymentIntentId = paymentIntent.id;
  await order.save();

  res.json({ orderId: order._id, clientSecret: paymentIntent.client_secret });

};


