import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { STRIPE_CONNECTION } from 'src/common/constants';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';

@Module({
  imports: [ConfigModule],
  providers: [
    StripeService,
    {
      provide: STRIPE_CONNECTION,
      useFactory: async (stripeService) => stripeService.getStripe(),
      inject: [StripeService],
    },
  ],
  controllers: [StripeController],
  exports: [STRIPE_CONNECTION, StripeService],
})
export class StripeModule {}
