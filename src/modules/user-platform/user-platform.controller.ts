import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserPlatformService } from './user-platform.service';
import { CreateUserPlatformDto } from './dto/create-user-platform.dto';
import { UpdateUserPlatformDto } from './dto/update-user-platform.dto';

@Controller('user-platform')
export class UserPlatformController {
  constructor(private readonly userPlatformService: UserPlatformService) {}

  @Post()
  create(@Body() createUserDto: CreateUserPlatformDto) {
    return this.userPlatformService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userPlatformService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userPlatformService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserPlatformDto: UpdateUserPlatformDto,
  ) {
    return this.userPlatformService.update(id, updateUserPlatformDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userPlatformService.remove(id);
  }
}
