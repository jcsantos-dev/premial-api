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

    @IsString()
    @IsOptional()
    requiredQuantity: string;

    @IsString()
    @IsOptional()
    requiredAmount: string;

    @IsBoolean()
    @IsNotEmpty()
    isActive: boolean;

    @IsString()
    @IsNotEmpty()
    rewardTypeId: string;

    @IsString()
    @IsNotEmpty()
    programTypeId: string;

    @IsString()
    @IsNotEmpty()
    couponTypeId: string;

    @IsString()
    @IsNotEmpty()
    storeId: string;
}
