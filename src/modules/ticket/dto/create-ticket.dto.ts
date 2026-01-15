import { IsNumber, IsString, IsArray, ValidateNested, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTicketItemDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  price_unit: number;

  @IsNumber()
  @IsNotEmpty()
  subtotal: number;
}

export class CreateTicketDto {
  @IsNumber()
  @IsNotEmpty()
  total_amount: number;

  @IsString()
  @IsNotEmpty()
  storeId: string;

  @IsString()
  @IsOptional()
  qr_scanned_by_user_id?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTicketItemDto)
  items: CreateTicketItemDto[];

  @IsBoolean()
  @IsOptional()
  isVisit?: boolean;
}
