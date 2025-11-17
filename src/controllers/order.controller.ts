import { Request, Response } from 'express';
import Cart from '../models/cart.model';
import Order from '../models/order.model';
import { createPaymentIntent } from '../services/stripe.service';
import { io } from '../services/socket.service';

export const createOrderFromCart = async (req: Request, res: Response) => {
  const userId = (req.user as any)._id;
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

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string | undefined;
  try {
    const event = (req as any).stripeEvent;

    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object;
      const orderId = pi.metadata.orderId;
      const order = await Order.findById(orderId);
      if (order) {
        order.paymentStatus = 'paid';
        await order.save();
        io.to(`order:${order._id}`).emit('order:paymentConfirmed', { orderId: order._id, paymentIntentId: pi.id });
      }
    } else if (event.type === 'payment_intent.payment_failed') {
      const pi = event.data.object;
      const orderId = pi.metadata.orderId;
      const order = await Order.findById(orderId);
      if (order) {
        order.paymentStatus = 'failed';
        await order.save();
        io.to(`order:${order._id}`).emit('order:paymentFailed', { orderId: order._id });
      }
    }
    res.json({ received: true });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : String(err);
    res.status(400).send(`Webhook Error: ${message}`);
  }
};

export const getOrder = async (req: Request, res: Response) => {
  const user = req.user as any;
  const order = await Order.findById(req.params.id).populate('items.product');
  if (!order) return res.status(404).json({ message: 'Not found' });
  if (user.role !== 'admin' && order.user.toString() !== String(user._id)) return res.status(403).json({ message: 'Forbidden' });
  res.json(order);
};

export const listOrders = async (req: Request, res: Response) => {
  const user = req.user as any;
  if (user.role === 'admin') {
    const list = await Order.find().populate('items.product').sort({ createdAt: -1 });
    return res.json(list);
  }
  const list = await Order.find({ user: user._id }).populate('items.product').sort({ createdAt: -1 });
  res.json(list);
};
