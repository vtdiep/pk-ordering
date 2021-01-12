import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNumber, IsOptional, Min } from 'class-validator';
export class CreateMenuDto implements Prisma.menuCreateWithoutMenu_X_categoryInput{
    name?: string;

    @Type(() => Number)
    // https://stackoverflow.com/questions/61187020/numeric-parameter-validation-fails-although-requirements-should-pass
    @IsInt()
    @Min(0)
    display_order: number;

    @IsOptional()
    @IsBoolean()
    active?: boolean;

    description?: string;
    private_note?: string;
}
