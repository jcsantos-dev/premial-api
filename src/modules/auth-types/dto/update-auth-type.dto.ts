import { PartialType } from '@nestjs/swagger';
import { CreateAuthTypeDto } from './create-auth-type.dto';

export class UpdateAuthTypeDto extends PartialType(CreateAuthTypeDto) {}
