import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserStoreService } from './user-store.service';
import { CreateUserStoreDto } from './dto/create-user-store.dto';
import { UpdateUserStoreDto } from './dto/update-user-store.dto';

@Controller('user-store')
export class UserStoreController {
  constructor(private readonly userStoreService: UserStoreService) {}

  @Post()
  create(@Body() createUserStoreDto: CreateUserStoreDto) {
    return this.userStoreService.create(createUserStoreDto);
  }

  @Get()
  findAll() {
    return this.userStoreService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userStoreService.findOne(id);
  }

  @Get('store/:storeId')
  findByStore(@Param('storeId') storeId: string) {
    return this.userStoreService.findByStore(storeId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserStoreDto: UpdateUserStoreDto,
  ) {
    return this.userStoreService.update(id, updateUserStoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userStoreService.remove(id);
  }
}
