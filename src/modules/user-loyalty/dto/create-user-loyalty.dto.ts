import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

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
    @MinLength(6)
    password?: string;

    @IsNotEmpty()
    storeId: string;
}
