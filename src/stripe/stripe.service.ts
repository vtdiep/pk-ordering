import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { chain } from 'lodash';
import { CreateOrderDto } from 'src/order/dto/create-order.dto';
import { OrderModoptDataDictByItemId } from 'src/order/order-modopt-data-dict.interface';
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

  // metadata: You can specify up to 50 keys, with key names up to 40 characters long and values up to 500 characters long.
  async createSession(
    order: CreateOrderDto,
    modoptDataDict: OrderModoptDataDictByItemId,
    metadata: Stripe.MetadataParam = {},
  ) {
    // parse order into line items
    let cart = order.details;

    let stripeCart: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    cart.items.forEach((item) => {
      stripeCart.push({
        amount: item.price * 100,
        currency: 'usd',
        name: item.name,
        description: item.mods?.reduce((acc, mod) => {
          let modIds = mod.modifierItemIds;
          let modOptCount = chain(modIds).countBy().value();
          // todo: order by display order
          let string = Object.entries(modOptCount)
            .map(
              ([itemId, quantity]) =>
                `${quantity}x ${modoptDataDict[itemId].modopt_name}`,
            )
            .join(' ');
          return [acc, string].filter(Boolean).join(' , ');
        }, ''),

        quantity: item.quantity,
        tax_rates: ['txr_1JLEYSK1K5eAIgYBrFMNybhl'],
      });
    });

    const session = await this.stripe.checkout.sessions.create({
      // todo: get transaction/order # from somewhere
      payment_intent_data: {
        description: 'Transaction #X',
      },
      metadata,
      payment_method_types: ['card'],

      line_items: stripeCart,

      mode: 'payment',

      success_url: `http://localhost:3002/?success=true.html`,

      cancel_url: `http://localhost:3002/?cancelled=true.html`,
    });
    console.log(`pending payment_intent id is ${session.payment_intent}`);
    return session;
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
