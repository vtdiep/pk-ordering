import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsInt,
  Min,
  IsString
} from 'class-validator';
import { OrderDetailModDto } from "./order-detail-mod.dto";

export class OrderDetailItemDto implements Prisma.JsonObject {
  [x: string]: Prisma.JsonValue;

  @IsInt()
  @Type(() => Number)
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  price: number;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity: number;

  @IsArray()
  @IsInt({
    each: true,
    message: '$property must be an array of integer numbers',
  })
  @Type(() => Number)
  mods: [OrderDetailModDto['id']];
}
