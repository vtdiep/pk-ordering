import { OmitType } from '@nestjs/mapped-types';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsNotEmptyObject, IsOptional, ValidateNested } from 'class-validator';
import { Item } from '../entities/item.entity';
import { _Category_From_Item_Dto } from './_Category_From_Item.dto';
import { _Modgroup_From_Item_Dto } from './_Modgroup_From_Item.dto';

export class CreateItemDto extends OmitType(Item, ['item_id'] as const) {
  name: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  active?: boolean;

  @IsOptional()
  is_standalone?: boolean;

  @IsOptional()
  price?: number;

  @IsOptional()
  private_note?: string;

  @IsOptional()
  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => _Category_From_Item_Dto)
  category?: _Category_From_Item_Dto;

  @IsOptional()
  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => _Modgroup_From_Item_Dto)
  modgroup?: _Modgroup_From_Item_Dto;
}
