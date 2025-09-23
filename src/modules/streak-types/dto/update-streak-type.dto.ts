import { PartialType } from '@nestjs/swagger';
import { CreateStreakTypeDto } from './create-streak-type.dto';

export class UpdateStreakTypeDto extends PartialType(CreateStreakTypeDto) {}
