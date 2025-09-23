import { PartialType } from '@nestjs/swagger';
import { CreateLevelTypeDto } from './create-level-type.dto';

export class UpdateLevelTypeDto extends PartialType(CreateLevelTypeDto) {}
