// import { PartialType } from '@nestjs/mapped-types';
import { OmitType } from '@nestjs/mapped-types';
import { order_status, Prisma } from '@prisma/client';
import { IsOptional } from 'class-validator';
import { Order } from '../entities/order.entity';
import { OrderDetailDto } from './order-details.dto';

// export class UpdateOrderDto extends PartialType(CreateOrderDto) {}

export class UpdateOrderDto extends OmitType(Order, [] as const) {
  oid: number;

  @IsOptional()
  email: string;

  @IsOptional()
  name: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  transaction_token?: string;

  @IsOptional()
  time_placed?: string | Date;

  @IsOptional()
  time_accepted?: string | Date;

  @IsOptional()
  pickup_time: string | Date;

  @IsOptional()
  amount_paid: number;

  @IsOptional()
  tax: number;

  @IsOptional()
  status?: order_status;

  @IsOptional()
  details: OrderDetailDto;
}
