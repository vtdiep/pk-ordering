import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';
import { OnlyPrimitives } from 'src/utils/types/only-primitives';

abstract class Category_X_Item_abstract
  implements OnlyPrimitives<Prisma.category_X_itemUncheckedCreateInput>
{
  @IsInt()
  @Type(() => Number)
  abstract category_id: number;

  @IsInt()
  @Type(() => Number)
  abstract item_id: number;

  @IsInt()
  @Type(() => Number)
  abstract display_order: number;
}

export class Category_X_Item extends Category_X_Item_abstract {
  category_id: number;
  item_id: number;
  display_order: number;
}
