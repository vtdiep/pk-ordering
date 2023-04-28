import { PartialType } from '@nestjs/mapped-types';
import { Prisma } from '@prisma/client';
import { CreateModgroupDto } from './create-modgroup.dto';
import { ModgroupBaseEntity } from '../entities/modgroup.entity';

export class UpdateModgroupDto extends PartialType(ModgroupBaseEntity) {}
