import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StreakConfService } from './streak-conf.service';
import { CreateStreakConfDto } from './dto/create-streak-conf.dto';
import { UpdateStreakConfDto } from './dto/update-streak-conf.dto';

@Controller('streak-conf')
export class StreakConfController {
  constructor(private readonly streakConfService: StreakConfService) {}

  @Post()
  create(@Body() createStreakConfDto: CreateStreakConfDto) {
    return this.streakConfService.create(createStreakConfDto);
  }

  @Get()
  findAll() {
    return this.streakConfService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.streakConfService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStreakConfDto: UpdateStreakConfDto,
  ) {
    return this.streakConfService.update(id, updateStreakConfDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.streakConfService.remove(id);
  }
}
