import { OmitType } from '@nestjs/mapped-types';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, isNotEmpty, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Menu } from '../entities/menu.entity';
export class CreateMenuDto extends OmitType(Menu,["menu_id"] as const) implements Prisma.menuCreateInput{

    name!: string;

    display_order!: number;

    @IsOptional()
    active?: boolean;

    @IsOptional()
    description?: string = "";

    @IsOptional()
    private_note?: string = "";
}
