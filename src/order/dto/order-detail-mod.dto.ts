import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class OrderDetailModDto {
  [x: string]: Prisma.JsonValue;

  @IsInt()
  @Type(() => Number)
  id: number;

  @IsInt({
    each: true,
    message: '$property must be an array of integer numbers',
  })
  @Type(() => Number)
  modOpts: number[];
}
