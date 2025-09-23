import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RewardTypesService } from './reward-types.service';
import { CreateRewardTypeDto } from './dto/create-reward-type.dto';
import { UpdateRewardTypeDto } from './dto/update-reward-type.dto';

@Controller('reward-types')
export class RewardTypesController {
  constructor(private readonly rewardTypesService: RewardTypesService) {}

  @Post()
  create(@Body() createRewardTypeDto: CreateRewardTypeDto) {
    return this.rewardTypesService.create(createRewardTypeDto);
  }

  @Get()
  findAll() {
    return this.rewardTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rewardTypesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRewardTypeDto: UpdateRewardTypeDto,
  ) {
    return this.rewardTypesService.update(id, updateRewardTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rewardTypesService.remove(id);
  }
}
