// eslint-disable-next-line max-classes-per-file
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

abstract class MenuXCategoryBaseEntity
  implements Prisma.menu_X_categoryUncheckedCreateInput
{
  @IsInt()
  @Type(() => Number)
  abstract category_id_category: number;

  @IsInt()
  @Type(() => Number)
  abstract menu_id_menu: number;

  @IsInt()
  @Type(() => Number)
  abstract display_order: number;
}

export class MenuXCategory extends MenuXCategoryBaseEntity {
  category_id_category: number;

  menu_id_menu: number;

  display_order: number;
}
