import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateUserStoreDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  storeId: string;

  @IsOptional()
  @IsString()
  roleId?: string;
}
