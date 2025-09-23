import { PartialType } from '@nestjs/swagger';
import { CreateUserLoyaltyDto } from './create-user-loyalty.dto';

export class UpdateUserLoyaltyDto extends PartialType(CreateUserLoyaltyDto) {}
