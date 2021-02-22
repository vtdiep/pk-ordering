import { Prisma } from "@prisma/client";
import { Type } from "class-transformer";
import { IsInt, IsNumber, IsString, Max, Min } from "class-validator";
import { OnlyPrimitives } from "src/utils/types/only-primitives";
import { Match } from "src/utils/validators/matchProperty";

export abstract class Modgroup_abstract implements OnlyPrimitives<Prisma.modgroupUncheckedCreateInput>{
    
    @IsInt()
    @Type(() => Number)
    mod_id?: number;

    @IsString()
    name: string;

    @IsInt()
    @Min(0)
    @Type(() => Number)
    @Match("must be <=",'max_selection', (thisProp:number, otherProp)=>{
        return (otherProp >= thisProp)
    })
    required_selection: number;

    @IsInt()
    @Min(0)
    @Max(10)
    @Type(() => Number)
    max_selection: number;

    @IsInt()
    @Min(0)
    @Type(() => Number)
    @Match("must be <=",'max_selection', (thisProp:number, otherProp)=>{
        return (otherProp >= thisProp)
    })
    max_single_select: number;

    @IsInt()
    @Min(0)
    @Match("must be <=",'max_selection', (thisProp:number, otherProp)=>{
        return (otherProp >= thisProp)
    })
    @Type(() => Number)
    free_selection: number;

    @IsNumber({maxDecimalPlaces:2})
    @Type( () => Number )
    @Min(0)
    price?: number;

    @IsString()
    description?: string;

    @IsString()
    private_note?: string;

}

export class Modgroup extends Modgroup_abstract{}