import { PartialType } from '@nestjs/swagger';
import { CreateUserCustomerDto } from './create-user-customer.dto';

export class UpdateUserCustomerDto extends PartialType(CreateUserCustomerDto) {}
