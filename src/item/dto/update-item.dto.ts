import { PartialType } from '@nestjs/mapped-types';
import { Prisma } from '@prisma/client';
import { CreateItemDto } from './create-item.dto';

export class UpdateItemDto extends PartialType(CreateItemDto) {}
