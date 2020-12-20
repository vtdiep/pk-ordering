import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEmail, IsPhoneNumber, IsDateString, IsJSON, IsOptional, IsIn, IsNumber, Min } from 'class-validator';

export class CreateOrderDto implements Prisma.orderCreateInput {

    @IsEmail()
    email: string;

    name: string;

    @IsOptional()
    @IsPhoneNumber('US')
    phone?: string;
    
    @IsOptional()
    transaction_token?: string;
    
    @IsOptional()
    @IsDateString()
    time_placed?: string | Date;
    
    @IsOptional()
    @IsDateString()
    time_accepted?: string | Date;
    
    @IsDateString()
    pickup_time: string | Date;
    
    @Type(() => Number)
    // https://stackoverflow.com/questions/61187020/numeric-parameter-validation-fails-although-requirements-should-pass
    @IsNumber({maxDecimalPlaces:2})
    @Min(0)
    amount_paid: number;
    
    @Type(() => Number)
    @IsNumber({maxDecimalPlaces:2})
    @Min(0)
    tax: number;
    
    @IsOptional()
    @IsIn(['NEW' , 'ACCEPTED' , 'FULFILLED' , 'CANCELLED'])
    status?: 'NEW' | 'ACCEPTED' | 'FULFILLED' | 'CANCELLED';
    
    @Type(() => String)
    @IsJSON()
    details: Prisma.InputJsonValue;
}