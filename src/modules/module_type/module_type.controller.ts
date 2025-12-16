import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ModuleTypeService } from './module_type.service';
import { CreateModuleTypeDto } from './dto/create-module_type.dto';
import { UpdateModuleTypeDto } from './dto/update-module_type.dto';

@Controller('module-type')
export class ModuleTypeController {
  constructor(private readonly moduleTypeService: ModuleTypeService) {}

  @Post()
  create(@Body() createModuleTypeDto: CreateModuleTypeDto) {
    return this.moduleTypeService.create(createModuleTypeDto);
  }

  @Get()
  findAll() {
    return this.moduleTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moduleTypeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateModuleTypeDto: UpdateModuleTypeDto,
  ) {
    return this.moduleTypeService.update(+id, updateModuleTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moduleTypeService.remove(+id);
  }
}
