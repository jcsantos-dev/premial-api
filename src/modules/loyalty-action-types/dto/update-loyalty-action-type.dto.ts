import { PartialType } from '@nestjs/swagger';
import { CreateLoyaltyActionTypeDto } from './create-loyalty-action-type.dto';

export class UpdateLoyaltyActionTypeDto extends PartialType(CreateLoyaltyActionTypeDto) {}
