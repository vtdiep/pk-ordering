import { Prisma } from "@prisma/client";
import { Type } from "class-transformer";
import { IsBoolean, IsInt } from "class-validator";
import { OnlyPrimitives } from "src/utils/types/only-primitives";

abstract class Item_X_Modgroup_abstract implements OnlyPrimitives<Prisma.item_X_modgroupUncheckedCreateInput>{
  
  @IsInt()
  @Type(()=>Number)
  abstract item_id: number;

  @IsInt()
  @Type(()=>Number)
  abstract mod_id: number;

  @IsBoolean()
  abstract item_is_standalone?: boolean;

  @IsInt()
  @Type(()=>Number)
  abstract display_order: number;
  }

export class Item_X_Modgroup extends Item_X_Modgroup_abstract{
  item_id: number;
  mod_id: number;
  item_is_standalone?: boolean;
  display_order: number;

 
}