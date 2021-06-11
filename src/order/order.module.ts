import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { KnexModule } from 'src/common/database/knex/knex.module';
import { PrismaModule } from 'src/common/database/prisma/prisma.module';

@Module({
  imports: [KnexModule, PrismaModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
