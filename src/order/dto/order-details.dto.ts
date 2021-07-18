import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { ValidateNested, IsArray, ArrayNotEmpty } from 'class-validator';
import { OrderDetailItemDto } from './order-detail-item.dto';

export class OrderDetailDto implements Prisma.JsonObject {
  [x: string]: Prisma.JsonValue;

  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @Type(() => OrderDetailItemDto)
  @IsArray()
  items: OrderDetailItemDto[];
}
