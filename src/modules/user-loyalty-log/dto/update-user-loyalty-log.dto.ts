import { PartialType } from '@nestjs/swagger';
import { CreateUserLoyaltyLogDto } from './create-user-loyalty-log.dto';

export class UpdateUserLoyaltyLogDto extends PartialType(CreateUserLoyaltyLogDto) {}
