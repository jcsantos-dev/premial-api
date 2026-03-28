import { IsBoolean, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateProgramDto {
  @IsNotEmpty()
  @IsString()
  storeId: string;

  @IsNotEmpty()
  @IsString()
  programTypeId: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
