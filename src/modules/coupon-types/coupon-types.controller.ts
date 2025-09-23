import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CouponTypesService } from './coupon-types.service';
import { CreateCouponTypeDto } from './dto/create-coupon-type.dto';
import { UpdateCouponTypeDto } from './dto/update-coupon-type.dto';

@Controller('coupon-types')
export class CouponTypesController {
  constructor(private readonly couponTypesService: CouponTypesService) {}

  @Post()
  create(@Body() createCouponTypeDto: CreateCouponTypeDto) {
    return this.couponTypesService.create(createCouponTypeDto);
  }

  @Get()
  findAll() {
    return this.couponTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.couponTypesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCouponTypeDto: UpdateCouponTypeDto,
  ) {
    return this.couponTypesService.update(id, updateCouponTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.couponTypesService.remove(id);
  }
}
