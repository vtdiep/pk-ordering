// import { PartialType } from '@nestjs/mapped-types';
import { order_status, Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsDateString,
  IsNumber,
  Min,
  IsIn,
  IsJSON,
  ValidateNested,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { OrderDetailDto } from './order-details.dto';

// export class UpdateOrderDto extends PartialType(CreateOrderDto) {}

export class UpdateOrderDto implements Prisma.orderUpdateInput {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsPhoneNumber('US')
  phone?: string;

  @IsOptional()
  transaction_token?: string;

  @IsOptional()
  @IsDateString()
  time_placed?: string | Date;

  @IsOptional()
  @IsDateString()
  time_accepted?: string | Date;

  @IsOptional()
  @IsDateString()
  pickup_time: string | Date;

  @IsOptional()
  @Type(() => Number)
  // https://stackoverflow.com/questions/61187020/numeric-parameter-validation-fails-although-requirements-should-pass
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount_paid: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  tax: number;

  @IsOptional()
  @IsIn(Object.values(order_status))
  status?: order_status;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OrderDetailDto)
  @IsNotEmpty()
  details: OrderDetailDto;
}
