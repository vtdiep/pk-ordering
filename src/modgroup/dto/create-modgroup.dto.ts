import { OmitType } from '@nestjs/mapped-types';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Match } from '../../utils/validators/matchProperty';
import { Modgroup } from '../entities/modgroup.entity';
export class CreateModgroupDto
  extends OmitType(Modgroup, ['mod_id'] as const)
  implements Prisma.modgroupCreateInput
{
  name: string;
  required_selection: number;
  max_selection: number;
  max_single_select: number;
  free_selection: number;

  @IsOptional()
  price?: number;

  @IsOptional()
  description?: string;

  @IsOptional()
  private_note?: string;
}
