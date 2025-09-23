import { PartialType } from '@nestjs/mapped-types';
import { CreateRewardTypeDto } from './create-reward-type.dto';

export class UpdateRewardTypeDto extends PartialType(CreateRewardTypeDto) {}
