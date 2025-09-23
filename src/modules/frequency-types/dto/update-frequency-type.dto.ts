import { PartialType } from '@nestjs/swagger';
import { CreateFrequencyTypeDto } from './create-frequency-type.dto';

export class UpdateFrequencyTypeDto extends PartialType(CreateFrequencyTypeDto) {}
