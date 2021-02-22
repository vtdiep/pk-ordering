import { Prisma } from "@prisma/client";
import { Type } from "class-transformer";
import { ValidateNested, IsArray, IsNotEmpty, IsNumber, IsInt, Min, IsString, isNotEmpty } from "class-validator";

export class OrderDetailDto implements Prisma.JsonObject{
    [x: string]: Prisma.JsonValue;

    @ValidateNested({each: true})
    @IsNotEmpty()
    @Type(()=>Item)
    @IsArray()
    items: [Item];
}

class Item implements Prisma.JsonObject{
    [x: string]: Prisma.JsonValue;

    @IsInt()
    @Type(()=>Number)
    id: number;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber({maxDecimalPlaces:2})
    @Type(()=>Number)
    price: number;

    @IsInt()
    @Min(1)
    @Type(()=>Number)
    quantity: number;

    @IsArray()
    @IsInt({each: true, message:"$property must be an array of integer numbers"})
    @Type(()=>Number)
    mods: [Mod["id"]]
}

class Mod{
    @IsInt()
    id: number;
}