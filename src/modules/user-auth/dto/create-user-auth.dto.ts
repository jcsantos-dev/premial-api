import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserAuthDto {
    @IsNotEmpty({ message: 'userId is required' })
    @Transform(({ value }) => {
        console.log('Transform userId:', value, 'type:', typeof value);
        // Si value es undefined/null, lanzar error
        if (value === undefined || value === null) {
            throw new Error('userId cannot be undefined or null in DTO transform');
        }
        return String(value); // Siempre convertir a string
    })
    userId: string;

    @IsNotEmpty({ message: 'authTypeId is required' })
    @Transform(({ value }) => {
        console.log('Transform authTypeId:', value, 'type:', typeof value);
        if (value === undefined || value === null) {
            throw new Error('authTypeId cannot be undefined or null in DTO transform');
        }
        const num = Number(value);
        if (isNaN(num)) {
            throw new Error('authTypeId must be a valid number');
        }
        return num;
    })
    authTypeId: number;

    @IsNotEmpty({ message: 'authUserProviderId is required' })
    @IsString()
    @Transform(({ value }) => {
        console.log('Transform authUserProviderId:', value, 'type:', typeof value);
        if (value === undefined || value === null || value.trim() === '') {
            throw new Error('authUserProviderId cannot be empty');
        }
        return value;
    })
    authUserProviderId: string;

    @IsOptional()
    @IsString()
    passwordHash?: string;
}