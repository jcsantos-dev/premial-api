import { PartialType } from '@nestjs/swagger';
import { CreateLevelConfDto } from './create-level-conf.dto';

export class UpdateLevelConfDto extends PartialType(CreateLevelConfDto) {}
