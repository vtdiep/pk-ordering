import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Prisma } from '@prisma/client';
import { MenuXCategory } from 'src/menu-x-category/entities/menu-x-category.entity';
import { CategoryXItem } from '../entities/category-x-item.entity';
import { CreateCategoryXItemDto } from './create-category-x-item.dto';

export class UpdateCategoryXItemDto extends OmitType(CategoryXItem, [
  'category_id',
  'item_id',
]) {
  display_order: number;
}
