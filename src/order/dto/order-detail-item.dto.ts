import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsInt,
  Min,
  IsString,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { OrderDetailModDto } from './order-detail-mod.dto';

export class OrderDetailItemDto implements Prisma.JsonObject {
  [x: string]: Prisma.JsonValue | undefined;

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

  @ValidateNested({ each: true })
  @Type(() => OrderDetailModDto)
  @IsArray()
  @IsOptional()
  mods?: [OrderDetailModDto];
}
