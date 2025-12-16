import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateStoreModuleDto {
  @IsString()
  storeId: string;

  @IsNumber()
  moduleTypeId: number;

  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;
}
