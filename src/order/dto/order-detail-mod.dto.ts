import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsInt } from 'class-validator';

export class OrderDetailModDto {
  [x: string]: Prisma.JsonValue;

  @IsInt()
  id: number;

  @IsArray()
  @IsInt({
    each: true,
    message: '$property must be an array of integer numbers',
  })
  modOpts: number[];
}
