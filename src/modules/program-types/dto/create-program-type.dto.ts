import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProgramTypeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
