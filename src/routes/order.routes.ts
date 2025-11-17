import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware';
import * as ctrl from '../controllers/order.controller';
import { constructEvent } from '../services/stripe.service';
import express from 'express';

const router: Router = Router();

router.post('/create', requireAuth, ctrl.createOrderFromCart);

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res, next) => {
  try {
    const sig = req.headers['stripe-signature'] as string | undefined;
    const stripeEvent = constructEvent(req.body, sig);
    // attach to req for controller usage
    (req as any).stripeEvent = stripeEvent;
    await ctrl.handleStripeWebhook(req, res);
  } catch (err: any) {
    console.error('Webhook error', err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

export default router;
