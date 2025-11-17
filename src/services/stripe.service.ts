import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export const createPaymentIntent = async (amount: number, currency = 'usd', metadata?: Record<string,string>) => {
  const pi = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // in cents
    currency,
    metadata
  });
  return pi;
};

export const retrievePaymentIntent = async (id: string) => {
  return stripe.paymentIntents.retrieve(id);
};

export const constructEvent = (payload: Buffer, signature: string | undefined) => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error('Stripe webhook secret not configured');
  return stripe.webhooks.constructEvent(payload, signature!, secret);
};

export default stripe;
