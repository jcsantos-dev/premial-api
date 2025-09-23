import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LevelConfService } from './level-conf.service';
import { CreateLevelConfDto } from './dto/create-level-conf.dto';
import { UpdateLevelConfDto } from './dto/update-level-conf.dto';

@Controller('level-conf')
export class LevelConfController {
  constructor(private readonly programService: LevelConfService) {}

  @Post()
  create(@Body() createLevelConfDto: CreateLevelConfDto) {
    return this.programService.create(createLevelConfDto);
  }

  @Get()
  findAll() {
    return this.programService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.programService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLevelConfDto: UpdateLevelConfDto,
  ) {
    return this.programService.update(id, updateLevelConfDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.programService.remove(id);
  }
}
