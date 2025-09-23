import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LevelTypesService } from './level-types.service';
import { CreateLevelTypeDto } from './dto/create-level-type.dto';
import { UpdateLevelTypeDto } from './dto/update-level-type.dto';

@Controller('level-types')
export class LevelTypesController {
  constructor(private readonly levelTypesService: LevelTypesService) {}

  @Post()
  create(@Body() createLevelTypeDto: CreateLevelTypeDto) {
    return this.levelTypesService.create(createLevelTypeDto);
  }

  @Get()
  findAll() {
    return this.levelTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.levelTypesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLevelTypeDto: UpdateLevelTypeDto,
  ) {
    return this.levelTypesService.update(id, updateLevelTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.levelTypesService.remove(id);
  }
}
