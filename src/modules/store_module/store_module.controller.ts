import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StoreModuleService } from './store_module.service';
import { CreateStoreModuleDto } from './dto/create-store_module.dto';
import { UpdateStoreModuleDto } from './dto/update-store_module.dto';

@Controller('store-module')
export class StoreModuleController {
  constructor(private readonly storeModuleService: StoreModuleService) {}

  @Post()
  create(@Body() createStoreModuleDto: CreateStoreModuleDto) {
    return this.storeModuleService.create(createStoreModuleDto);
  }

  @Get()
  findAll() {
    return this.storeModuleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storeModuleService.findOne(+id);
  }

  @Get('store/:storeId')
  findByStore(@Param('storeId') storeId: string) {
    return this.storeModuleService.findByStore(storeId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStoreModuleDto: UpdateStoreModuleDto,
  ) {
    return this.storeModuleService.update(+id, updateStoreModuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storeModuleService.remove(+id);
  }
}
