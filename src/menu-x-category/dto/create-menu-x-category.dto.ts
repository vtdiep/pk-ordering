import { Prisma } from '@prisma/client';
import { Menu_X_Category } from '../entities/menu-x-category.entity';

export class CreateMenuXCategoryDto extends Menu_X_Category {
  category_id_category: number;
  menu_id_menu: number;
  display_order: number;
}
