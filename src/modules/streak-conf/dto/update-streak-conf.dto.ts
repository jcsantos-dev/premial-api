import { PartialType } from '@nestjs/swagger';
import { CreateStreakConfDto } from './create-streak-conf.dto';

export class UpdateStreakConfDto extends PartialType(CreateStreakConfDto) {}
