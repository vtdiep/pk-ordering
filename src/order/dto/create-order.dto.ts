import { OmitType } from '@nestjs/mapped-types';
import { Decimal } from '@prisma/client/runtime';
import { IsOptional } from 'class-validator';
import { Order } from '../entities/order.entity';
import { OrderDetailDto } from './order-details.dto';

export class CreateOrderDto extends OmitType(Order, [
  'oid',
  'time_accepted',
  'status',
  'transaction_token',
  'time_placed',
] as const) {
  email: string;

  name: string;

  @IsOptional()
  phone?: string | undefined | null;

  pickup_time: string | Date;

  amount_paid: number | Decimal;

  tax: number | Decimal;

  details: OrderDetailDto;
}
