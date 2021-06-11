import { OmitType } from '@nestjs/mapped-types';
import { Prisma } from '@prisma/client';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Category } from '../entities/category.entity';
export class CreateCategoryDto
  extends OmitType(Category, ['category_id'] as const)
  implements Prisma.categoryCreateInput
{
  name?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  active?: boolean;

  @IsOptional()
  private_note?: string;

  category_X_item?: Prisma.category_X_itemCreateNestedManyWithoutCategoryInput;
  menu_X_category?: Prisma.menu_X_categoryCreateNestedManyWithoutCategoryInput;
}
