import { OmitType, PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';
import { Category } from 'src/category/entities/category.entity';
import { Category_X_Item } from 'src/common/lib/category_X_item/category_X_item.entity';
import { OnlyPrimitives } from 'src/utils/types/only-primitives';

export class _Category_From_Item_Dto {
  @ValidateNested()
  @Type(() =>
    OmitType(CreateCategoryDto, ['category_X_item', 'menu_X_category']),
  )
  create?: OnlyPrimitives<Category>;

  @ValidateNested()
  @Type(() => PickType(Category, ['category_id'] as const))
  link?: Required<Pick<Category, 'category_id'>>;

  @ValidateNested()
  @Type(() => PickType(Category_X_Item, ['display_order'] as const))
  join_details: Pick<Category_X_Item, 'display_order'>;
}
