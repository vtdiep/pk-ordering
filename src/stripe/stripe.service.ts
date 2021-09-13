import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  constructor(private configService: ConfigService) {}

  private stripe: Stripe;

  async onModuleInit() {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_PRIVATE_KEY', ''),
      {
        apiVersion: '2020-08-27',
      },
    );
    Logger.log(`Stripe key loaded`, 'Stripe');
  }

  async create_t(res: Response) {
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
    console.log(`pending payment_intent id is ${session.payment_intent}`);
    res.redirect(303, session.url!);
  }

  getStripe() {
    return this.stripe;
  }
}
