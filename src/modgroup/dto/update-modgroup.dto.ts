import { PartialType } from '@nestjs/mapped-types';
import { Prisma } from '@prisma/client';
import { CreateModgroupDto } from './create-modgroup.dto';

export class UpdateModgroupDto extends PartialType(CreateModgroupDto) {}
