import { OmitType, PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';
import { Category } from 'src/category/entities/category.entity';
import { Category_X_Item } from 'src/common/lib/category_X_item/category_X_item.entity';
import { Item_X_Modgroup } from 'src/common/lib/item_X_modgroup/item_X_modgroup.entity';
import { CreateModgroupDto } from 'src/modgroup/dto/create-modgroup.dto';
import { Modgroup } from 'src/modgroup/entities/modgroup.entity';
import { OnlyPrimitives } from 'src/utils/types/only-primitives';

export class _Modgroup_From_Item_Dto {

    @ValidateNested()
    @Type(() => CreateModgroupDto)
    create?: OnlyPrimitives<CreateModgroupDto>;

    @ValidateNested()
    @Type(() => PickType(Modgroup, ["mod_id"] as const))
    link?: Required<Pick<Category, "category_id">>;

    @ValidateNested()
    @Type(() => PickType(Item_X_Modgroup, ["display_order","item_is_standalone"] as const))
    join_details: Pick<Item_X_Modgroup, "display_order" | "item_is_standalone">;
}
