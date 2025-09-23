import { PartialType } from '@nestjs/swagger';
import { CreateUserStoreDto } from './create-user-store.dto';

export class UpdateUserStoreDto extends PartialType(CreateUserStoreDto) {}
