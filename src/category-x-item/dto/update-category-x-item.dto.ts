import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Prisma } from '@prisma/client';
import { Menu_X_Category } from 'src/menu-x-category/entities/menu-x-category.entity';
import { Category_X_Item } from '../entities/category-x-item.entity';
import { CreateCategoryXItemDto } from './create-category-x-item.dto';

export class UpdateCategoryXItemDto extends OmitType(Category_X_Item, [
  'category_id',
  'item_id',
]) {
  display_order: number;
}
