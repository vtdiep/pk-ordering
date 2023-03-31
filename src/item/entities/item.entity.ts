// eslint-disable-next-line max-classes-per-file
import { item_X_modgroup, Prisma } from '@prisma/client';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
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
  abstract description?: string | null;

  @IsBoolean()
  @Transform(ToBooleanFromString())
  abstract active?: boolean;

  @IsBoolean()
  @Transform(ToBooleanFromString())
  abstract is_standalone?: boolean;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  abstract price?: number | Prisma.Decimal | null;

  @IsString()
  abstract private_note?: string | null;
}

export class Item extends ItemBaseEntity {
  item_id?: number;

  name: string;

  description?: string;

  active?: boolean;

  is_standalone?: boolean;

  price?: number | Prisma.Decimal;

  private_note?: string;
}

export class ItemEntity extends ItemBaseEntity {
  item_id?: number;

  name: string;

  description?: string | null;

  active?: boolean;

  is_standalone?: boolean;

  price?: number | Prisma.Decimal | null;

  @Expose({ name: 'mods' })
  item_X_modgroup: item_X_modgroup[];

  @Exclude()
  private_note?: string | null;

  constructor(partial: Partial<ItemEntity>) {
    super();
    Object.assign(this, partial);
  }
}
