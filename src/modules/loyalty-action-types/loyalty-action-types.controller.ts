import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LoyaltyActionTypesService } from './loyalty-action-types.service';
import { CreateLoyaltyActionTypeDto } from './dto/create-loyalty-action-type.dto';
import { UpdateLoyaltyActionTypeDto } from './dto/update-loyalty-action-type.dto';

@Controller('loyalty-action-types')
export class LoyaltyActionTypesController {
  constructor(
    private readonly levelActionTypesService: LoyaltyActionTypesService,
  ) {}

  @Post()
  create(@Body() createLevelActionTypeDto: CreateLoyaltyActionTypeDto) {
    return this.levelActionTypesService.create(createLevelActionTypeDto);
  }

  @Get()
  findAll() {
    return this.levelActionTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.levelActionTypesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLevelActionTypeDto: UpdateLoyaltyActionTypeDto,
  ) {
    return this.levelActionTypesService.update(id, updateLevelActionTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.levelActionTypesService.remove(id);
  }
}
