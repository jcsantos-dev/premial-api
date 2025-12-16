import { PartialType } from '@nestjs/swagger';
import { CreateStoreModuleDto } from './create-store_module.dto';

export class UpdateStoreModuleDto extends PartialType(CreateStoreModuleDto) {}
