import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { OnlyPrimitives } from 'src/utils/types/only-primitives';

export abstract class Category_abstract
  implements OnlyPrimitives<Prisma.categoryUncheckedCreateInput>
{
  @Type(() => Number)
  @IsNumber()
  abstract category_id?: number;

  @IsString()
  @IsNotEmpty()
  abstract name?: string;

  @IsString()
  abstract description?: string;

  @IsBoolean()
  abstract active?: boolean;

  @IsString()
  abstract private_note?: string;
}
export class Category extends Category_abstract {
  category_id?: number;

  name?: string;

  description?: string;

  active?: boolean;

  private_note?: string;
}
