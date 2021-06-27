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
  phone?: string | null | undefined;

  @IsOptional()
  transaction_token?: string | null | undefined;

  @IsOptional()
  time_placed?: string | Date | undefined;

  @IsOptional()
  time_accepted?: string | Date | null | undefined;

  @IsOptional()
  pickup_time: string | Date;

  @IsOptional()
  amount_paid: number | Prisma.Decimal;

  @IsOptional()
  tax: number | Prisma.Decimal;

  @IsOptional()
  status?: order_status | undefined;

  @IsOptional()
  details: OrderDetailDto;
}
