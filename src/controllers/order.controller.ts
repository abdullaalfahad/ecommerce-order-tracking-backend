import { Request, Response } from 'express';
import Cart from '../models/cart.model';
import Order from '../models/order.model';
import { createPaymentIntent } from '../services/stripe.service';
import { io } from '../services/socket.service';

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
