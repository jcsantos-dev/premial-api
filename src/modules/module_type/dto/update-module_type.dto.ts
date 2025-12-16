import { PartialType } from '@nestjs/swagger';
import { CreateModuleTypeDto } from './create-module_type.dto';

export class UpdateModuleTypeDto extends PartialType(CreateModuleTypeDto) {}
