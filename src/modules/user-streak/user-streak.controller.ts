import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserStreakService } from './user-streak.service';
import { CreateUserStreakDto } from './dto/create-user-streak.dto';
import { UpdateUserStreakDto } from './dto/update-user-streak.dto';

@Controller('user-streake')
export class UserStreakController {
  constructor(private readonly userStreakService: UserStreakService) {}

  @Post()
  create(@Body() createUserStreakDto: CreateUserStreakDto) {
    return this.userStreakService.create(createUserStreakDto);
  }

  @Get()
  findAll() {
    return this.userStreakService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userStreakService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserStreakDto: UpdateUserStreakDto,
  ) {
    return this.userStreakService.update(id, updateUserStreakDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userStreakService.remove(id);
  }
}
