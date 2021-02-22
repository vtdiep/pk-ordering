import { Prisma } from "@prisma/client";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

abstract class Category_X_Item_abstract implements Prisma.category_X_itemUncheckedCreateInput{

    @IsInt()
    @IsNotEmpty()
    @Type( () => Number )
    abstract category_id: number;

    @IsInt()
    @IsNotEmpty()
    @Type( () => Number )
    abstract item_id: number;

    @IsInt()
    @IsNotEmpty()
    @Type( () => Number )
    abstract display_order: number;
}

export class Category_X_Item extends Category_X_Item_abstract{
    category_id: number;
    item_id: number;
    display_order: number;

}