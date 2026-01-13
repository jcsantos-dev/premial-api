import {
    IsBoolean,
    IsDateString,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCouponDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ required: false })
    @IsDateString()
    @IsOptional()
    validFrom?: string;

    @ApiProperty({ required: false })
    @IsDateString()
    @IsOptional()
    validTo?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    requiredQuantity?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    requiredAmount?: string;

    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    isActive: boolean;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    rewardTypeId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    programTypeId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    couponTypeId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    storeId: string;
}

