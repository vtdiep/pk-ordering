import { Prisma } from '@prisma/client';
import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';

export class OrderDetailModDto {
  [x: string]: Prisma.JsonValue;

  @IsInt()
  id: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({
    each: true,
    message: '$property must be an array of integer numbers',
  })
  modifierItemIds: number[];
}
