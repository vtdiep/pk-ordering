import { Prisma } from '@prisma/client';
import { MenuXCategory } from '../entities/menu-x-category.entity';

export class CreateMenuXCategoryDto extends MenuXCategory {
  category_id_category: number;

  menu_id_menu: number;

  display_order: number;
}
