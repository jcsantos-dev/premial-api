import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserLoyaltyLogService } from './user-loyalty-log.service';
import { CreateUserLoyaltyLogDto } from './dto/create-user-loyalty-log.dto';
import { UpdateUserLoyaltyLogDto } from './dto/update-user-loyalty-log.dto';

@Controller('user-loyalty-log')
export class UserLoyaltyLogController {
  constructor(private readonly userLoyaltyLogService: UserLoyaltyLogService) {}

  @Post()
  create(@Body() createUserLoyaltyLogDto: CreateUserLoyaltyLogDto) {
    return this.userLoyaltyLogService.create(createUserLoyaltyLogDto);
  }

  @Get()
  findAll() {
    return this.userLoyaltyLogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userLoyaltyLogService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserLoyaltyLogDto: UpdateUserLoyaltyLogDto,
  ) {
    return this.userLoyaltyLogService.update(id, updateUserLoyaltyLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userLoyaltyLogService.remove(id);
  }
}
