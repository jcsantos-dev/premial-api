import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';

export class CreateUserLoyaltyDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsOptional()
    birthdate?: string;

    @IsString()
    @IsOptional()
    @ValidateIf(o => o.password && o.password.length > 0)
    @MinLength(6)
    password?: string;

    @IsNotEmpty()
    storeId: string;
}
