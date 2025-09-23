import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StreakTypesService } from './streak-types.service';
import { CreateStreakTypeDto } from './dto/create-streak-type.dto';
import { UpdateStreakTypeDto } from './dto/update-streak-type.dto';

@Controller('streak-types')
export class StreakTypesController {
  constructor(private readonly streakTypesService: StreakTypesService) {}

  @Post()
  create(@Body() createStreakTypeDto: CreateStreakTypeDto) {
    return this.streakTypesService.create(createStreakTypeDto);
  }

  @Get()
  findAll() {
    return this.streakTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.streakTypesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStreakTypeDto: UpdateStreakTypeDto,
  ) {
    return this.streakTypesService.update(id, updateStreakTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.streakTypesService.remove(id);
  }
}
