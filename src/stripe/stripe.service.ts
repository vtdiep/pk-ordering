import { Injectable, Logger } from '@nestjs/common';
import dotenv from 'dotenv';
import { Response } from 'express';
import path from 'path';
import Stripe from 'stripe';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

@Injectable()
export class StripeService {
  private stripe: Stripe;

  async onModuleInit() {
    this.stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!, {
      apiVersion: '2020-08-27',
    });
    Logger.log(`Stripe key loaded`, 'Stripe');
  }

  async create(res: Response) {
    const session = await this.stripe.checkout.sessions.create({
      payment_intent_data: {
        description: 'Transaction #X',
      },
      payment_method_types: ['card'],

      line_items: [
        {
          amount: 2000,
          currency: 'usd',
          name: 'Item 1 Name',
          description: 'Item 1 description',
          quantity: 1,
          tax_rates: ['txr_1JLEYSK1K5eAIgYBrFMNybhl'],
        },
        {
          amount: 400,
          currency: 'usd',
          name: 'Item 2 Name',
          description: 'Item 2 description',
          quantity: 2,
          tax_rates: ['txr_1JLEYSK1K5eAIgYBrFMNybhl'],
        },
      ],

      mode: 'payment',

      success_url: `http://localhost:3000/success.html`,

      cancel_url: `http://localhost:3000/cancel.html`,
    });

    res.redirect(303, session.url!);
  }
}
