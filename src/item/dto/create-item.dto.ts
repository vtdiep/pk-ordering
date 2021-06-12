import { OmitType } from '@nestjs/mapped-types';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsNotEmptyObject, IsOptional, ValidateNested } from 'class-validator';
import { Item } from '../entities/item.entity';
import { CategoryRefFromItemDto } from './category-ref-from-item.dto';
import { ModgroupRefFromItemDto } from './modgroup-ref-from-item.dto';

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
  @Type(() => CategoryRefFromItemDto)
  category?: CategoryRefFromItemDto;

  @IsOptional()
  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => ModgroupRefFromItemDto)
  modgroup?: ModgroupRefFromItemDto;
}
