import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Prisma } from '@prisma/client';
import { IsOptional } from 'class-validator';
import { OnlyPrimitives } from 'src/utils/types/only-primitives';
import { Menu, Menu_abstract } from '../entities/menu.entity';
import { CreateMenuDto } from './create-menu.dto';

export class UpdateMenuDto extends PartialType(Menu) {
  @IsOptional()
  name?: string;

  @IsOptional()
  display_order?: number;

  @IsOptional()
  active?: boolean;

  @IsOptional()
  description?: string;

  @IsOptional()
  private_note?: string;
}
