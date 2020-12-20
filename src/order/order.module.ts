import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from 'providers/database/prisma/prisma.service';

@Module({
  controllers: [OrderController],
  providers: [PrismaService, OrderService]
})
export class OrderModule {}
