import { OmitType, PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';
import { Category } from 'src/category/entities/category.entity';
import { CategoryXItem } from 'src/common/lib/category_X_item/category_X_item.entity';
import { OnlyPrimitives } from 'src/utils/types/only-primitives';

export class CategoryRefFromItemDto {
  @ValidateNested()
  @Type(() =>
    OmitType(CreateCategoryDto, ['category_X_item', 'menu_X_category']),
  )
  create?: OnlyPrimitives<Category>;

  @ValidateNested()
  @Type(() => PickType(Category, ['category_id'] as const))
  link?: Required<Pick<Category, 'category_id'>>;

  @ValidateNested()
  @Type(() => PickType(CategoryXItem, ['display_order'] as const))
  join_details: Pick<CategoryXItem, 'display_order'>;
}
