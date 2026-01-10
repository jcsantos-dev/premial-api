import {
    IsBoolean,
    IsDateString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateCouponDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsDateString()
    @IsOptional()
    validFrom: string;

    @IsDateString()
    @IsOptional()
    validTo: string;

    @IsNumber()
    @IsOptional()
    requiredQuantity: number;

    @IsNumber()
    @IsOptional()
    requiredAmount: number;

    @IsBoolean()
    @IsNotEmpty()
    isActive: boolean;

    @IsNumber()
    @IsNotEmpty()
    rewardTypeId: number;

    @IsNumber()
    @IsNotEmpty()
    programTypeId: number;

    @IsNumber()
    @IsNotEmpty()
    couponTypeId: number;

    @IsNumber()
    @IsNotEmpty()
    storeId: number;
}
