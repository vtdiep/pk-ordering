// eslint-disable-next-line max-classes-per-file
import { Prisma } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
  Min,
} from 'class-validator';
import { ToBooleanFromString } from 'src/utils/transformers/toBooleanFromString';
import { OnlyPrimitives } from 'src/utils/types/only-primitives';

export abstract class ItemBaseEntity
  implements OnlyPrimitives<Prisma.itemUncheckedCreateInput>
{
  @Type(() => Number)
  @IsNumber()
  abstract item_id?: number;

  @IsString()
  @IsNotEmpty()
  abstract name: string;

  @IsString()
  abstract description?: string;

  @IsBoolean()
  @Transform(ToBooleanFromString())
  abstract active?: boolean;

  @IsBoolean()
  @Transform(ToBooleanFromString())
  abstract is_standalone?: boolean;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  abstract price?: number;

  @IsString()
  abstract private_note?: string;
}

export class Item extends ItemBaseEntity {
  item_id?: number;

  name: string;

  description?: string;

  active?: boolean;

  is_standalone?: boolean;

  price?: number;

  private_note?: string;
}
