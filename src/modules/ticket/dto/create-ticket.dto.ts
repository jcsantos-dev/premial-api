import { IsNumber, IsString, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTicketItemDto)
  items: CreateTicketItemDto[];
}
