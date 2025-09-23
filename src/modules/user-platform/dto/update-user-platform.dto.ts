import { PartialType } from '@nestjs/swagger';
import { CreateUserPlatformDto } from './create-user-platform.dto';

export class UpdateUserPlatformDto extends PartialType(CreateUserPlatformDto) {}
