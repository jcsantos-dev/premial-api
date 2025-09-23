import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserLoyaltyService } from './user-loyalty.service';
import { CreateUserLoyaltyDto } from './dto/create-user-loyalty.dto';
import { UpdateUserLoyaltyDto } from './dto/update-user-loyalty.dto';

@Controller('user-loyalty')
export class UserLoyaltyController {
  constructor(private readonly userLoyaltyService: UserLoyaltyService) {}

  @Post()
  create(@Body() createUserLoyaltyDto: CreateUserLoyaltyDto) {
    return this.userLoyaltyService.create(createUserLoyaltyDto);
  }

  @Get()
  findAll() {
    return this.userLoyaltyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userLoyaltyService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserLoyaltyDto: UpdateUserLoyaltyDto,
  ) {
    return this.userLoyaltyService.update(id, updateUserLoyaltyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userLoyaltyService.remove(id);
  }
}
