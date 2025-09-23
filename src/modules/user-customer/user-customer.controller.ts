import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserCustomerService } from './user-customer.service';
import { CreateUserCustomerDto } from './dto/create-user-customer.dto';
import { UpdateUserCustomerDto } from './dto/update-user-customer.dto';

@Controller('UserCustomer-customer')
export class UserCustomerController {
  constructor(private readonly UserCustomerService: UserCustomerService) {}

  @Post()
  create(@Body() createUserCustomerDto: CreateUserCustomerDto) {
    return this.UserCustomerService.create(createUserCustomerDto);
  }

  @Get()
  findAll() {
    return this.UserCustomerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.UserCustomerService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserCustomerDto: UpdateUserCustomerDto,
  ) {
    return this.UserCustomerService.update(id, updateUserCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.UserCustomerService.remove(id);
  }
}
