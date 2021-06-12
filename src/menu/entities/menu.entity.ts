import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { OnlyPrimitives } from 'src/utils/types/only-primitives';

export abstract class MenuBaseEntity
  implements OnlyPrimitives<Prisma.menuUncheckedCreateInput>
{
  @Type(() => Number)
  @IsInt()
  abstract menu_id?: number;

  @IsString()
  @IsNotEmpty()
  abstract name?: string;

  @Type(() => Number)
  // https://stackoverflow.com/questions/61187020/numeric-parameter-validation-fails-although-requirements-should-pass
  @IsInt()
  @Min(0)
  abstract display_order: number;

  @IsBoolean()
  abstract active?: boolean;

  @IsString()
  abstract description?: string;

  @IsString()
  abstract private_note?: string;
}
export class Menu extends MenuBaseEntity {
  menu_id?: number;

  name?: string;

  display_order: number;

  active?: boolean;

  description?: string;

  private_note?: string;
}
