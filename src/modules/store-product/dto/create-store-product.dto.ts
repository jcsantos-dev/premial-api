import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsOptional,
} from 'class-validator';

export class CreateStoreProductDto {
  @IsNumber()
  @IsPositive()
  storeId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsOptional()
  set_points?: number;

  @IsBoolean()
  is_active: boolean;
}
