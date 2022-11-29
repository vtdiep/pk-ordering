import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { STRIPE_CLIENT, STRIPE_CONNECTION } from 'src/common/constants';
import Stripe from 'stripe';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';

@Module({
  imports: [ConfigModule],
  providers: [
    ConfigModule,
    StripeService,
    {
      provide: STRIPE_CLIENT,
      useFactory: (config: ConfigService) =>
        new Stripe(config.get<string>('STRIPE_PRIVATE_KEY', ''), {
          apiVersion: '2020-08-27',
        }),
      // useFactory: async (stripeService) => stripeService.getStripe(),

      inject: [ConfigService],
    },
  ],
  controllers: [StripeController],
  exports: [STRIPE_CLIENT, StripeService],
})
export class StripeModule {}
