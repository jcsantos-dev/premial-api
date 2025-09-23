import { PartialType } from '@nestjs/mapped-types';
import { CreateProgramTypeDto } from './create-program-type.dto';

export class UpdateProgramTypeDto extends PartialType(CreateProgramTypeDto) {}
