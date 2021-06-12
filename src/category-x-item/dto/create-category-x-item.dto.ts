import { Prisma } from '@prisma/client';
import { Menu_X_Category } from 'src/menu-x-category/entities/menu-x-category.entity';
import { Category_X_Item } from '../entities/category-x-item.entity';
export class CreateCategoryXItemDto extends Category_X_Item {
  category_id: number;

  item_id: number;

  display_order: number;
}
