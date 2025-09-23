import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FrequencyTypesService } from './frequency-types.service';
import { CreateFrequencyTypeDto } from './dto/create-frequency-type.dto';
import { UpdateFrequencyTypeDto } from './dto/update-frequency-type.dto';

@Controller('frequency-types')
export class FrequencyTypesController {
  constructor(private readonly frequencyTypesService: FrequencyTypesService) {}

  @Post()
  create(@Body() createFrequencyTypeDto: CreateFrequencyTypeDto) {
    return this.frequencyTypesService.create(createFrequencyTypeDto);
  }

  @Get()
  findAll() {
    return this.frequencyTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.frequencyTypesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFrequencyTypeDto: UpdateFrequencyTypeDto,
  ) {
    return this.frequencyTypesService.update(id, updateFrequencyTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.frequencyTypesService.remove(id);
  }
}
