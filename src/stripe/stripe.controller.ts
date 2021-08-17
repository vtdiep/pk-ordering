import { Controller, Post, Req, Res, Headers } from '@nestjs/common';
import { Response } from 'express';
import { Stripe } from 'stripe';
import { ConfigService } from '@nestjs/config';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly configService: ConfigService,
  ) {}

  @Post('checkout')
  async login(@Res() res) {
    return this.stripeService.create(res);
  }

  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') sig: string,
    @Req() request,
    @Res() res: Response,
  ) {
    let event = request.body;
    try {
      event = this.stripeService
        .getStripe()
        .webhooks.constructEvent(
          request.body,
          sig,
          this.configService.get<string>('STRIPE_WS_ENDPOINT_SECRET', ''),
        );
    } catch (err) {
      // invalid signature
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      res.status(400).end();
      return;
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        break;
      }
      case 'payment_method.attached': {
        const paymentMethod = event.data.object;
        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
        break;
      }
      case 'checkout.session.completed': {
        const checkoutSession: Stripe.Response<Stripe.Checkout.Session> =
          event.data.object;
        console.log(`${checkoutSession}`);
        console.log(
          `webhook response: payment_intent id ${checkoutSession.payment_intent}`,
        );
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    // console.log(`${event.type}`)

    // need .end() in order to avoid ERRORs in stripe cli
    // https://stackoverflow.com/a/68440790
    res.end();
  }
}
