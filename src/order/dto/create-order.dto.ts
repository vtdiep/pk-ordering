import { OmitType } from '@nestjs/mapped-types';
import {
  IsOptional,
} from 'class-validator';
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
  phone?: string;

  pickup_time: string | Date;

  amount_paid: number;

  tax: number;

  details: OrderDetailDto;
}
