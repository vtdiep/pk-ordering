import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ValidateNested,
  IsArray,
  IsNotEmpty,
  isNotEmpty,
} from 'class-validator';
import { OrderDetailItemDto } from './order-detail-item.dto';

export class OrderDetailDto implements Prisma.JsonObject {
  [x: string]: Prisma.JsonValue;

  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => OrderDetailItemDto)
  @IsArray()
  items: [OrderDetailItemDto];
}
