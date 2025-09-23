import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { CreateUserAuthDto } from './dto/create-user-auth.dto';
import { UpdateUserAuthDto } from './dto/update-user-auth.dto';

@Controller('userAuth-auth')
export class UserAuthController {
  constructor(private readonly userAuthsService: UserAuthService) {}

  @Post()
  create(@Body() createUserAuthDto: CreateUserAuthDto) {
    return this.userAuthsService.create(createUserAuthDto);
  }

  @Get()
  findAll() {
    return this.userAuthsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userAuthsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserAuthDto: UpdateUserAuthDto,
  ) {
    return this.userAuthsService.update(id, updateUserAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userAuthsService.remove(id);
  }
}
