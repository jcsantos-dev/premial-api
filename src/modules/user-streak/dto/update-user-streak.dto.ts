import { PartialType } from '@nestjs/swagger';
import { CreateUserStreakDto } from './create-user-streak.dto';

export class UpdateUserStreakDto extends PartialType(CreateUserStreakDto) {}
