import { Module } from '@nestjs/common';
import { KnexModule } from 'src/common/database/knex/knex.module';
import { PrismaModule } from 'src/common/database/prisma/prisma.module';
import { StoreConfirmationModule } from 'src/store-confirmation/store-confirmation.module';
import { StripeModule } from 'src/stripe/stripe.module';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

@Module({
  imports: [KnexModule, PrismaModule, StoreConfirmationModule, StripeModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
