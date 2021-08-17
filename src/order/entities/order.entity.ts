// eslint-disable-next-line max-classes-per-file
import { order_status, Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsEmail,
  IsDateString,
  IsIn,
  IsOptional,
  IsPhoneNumber,
  ValidateNested,
} from 'class-validator';
import { OnlyPrimitives } from 'src/utils/types/only-primitives';
import { OrderDetailDto } from '../dto/order-details.dto';

export abstract class OrderBaseEntity
  implements OnlyPrimitives<Prisma.orderUncheckedCreateInput>
{
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  oid?: number | undefined;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsPhoneNumber('US')
  phone?: string | null | undefined;

  @IsString()
  transaction_token?: string | null | undefined;

  @IsDateString()
  time_placed?: string | Date | undefined;

  @IsDateString()
  time_accepted?: string | Date | null | undefined;

  @IsDateString()
  pickup_time: string | Date;

  @Type(() => Number)
  // https://stackoverflow.com/questions/61187020/numeric-parameter-validation-fails-although-requirements-should-pass
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount_paid: string | number | Prisma.Decimal;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  tax: string | number | Prisma.Decimal;

  @IsIn(Object.values(order_status))
  status?: order_status | undefined;

  @ValidateNested({ each: true })
  @Type(() => OrderDetailDto)
  @IsNotEmpty()
  details: Prisma.InputJsonValue;

  @IsString()
  stripe_payment_intent: string;
}

export class Order extends OrderBaseEntity {
  oid?: number | undefined;

  email: string;

  name: string;

  phone?: string | null | undefined;

  transaction_token?: string | null | undefined;

  time_placed?: string | Date | undefined;

  time_accepted?: string | Date | null | undefined;

  pickup_time: string | Date;

  amount_paid: string | number | Prisma.Decimal;

  tax: string | number | Prisma.Decimal;

  status?: order_status | undefined;

  details: Prisma.InputJsonValue;

  stripe_payment_intent: string;
}
