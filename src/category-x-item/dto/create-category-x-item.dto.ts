import { Prisma } from '@prisma/client';
import { MenuXCategory } from 'src/menu-x-category/entities/menu-x-category.entity';
import { CategoryXItem } from '../entities/category-x-item.entity';

export class CreateCategoryXItemDto extends CategoryXItem {
  category_id: number;

  item_id: number;

  display_order: number;
}
