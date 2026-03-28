import { IsString, IsOptional, IsBoolean, IsUUID } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsUUID()
  @IsOptional()
  uuid?: string;

  @IsString()
  @IsOptional()
  logo_url?: string;

  @IsString()
  @IsOptional()
  square_logo_url?: string;

  @IsString()
  @IsOptional()
  location_url?: string;

  @IsString()
  @IsOptional()
  phone_number?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
