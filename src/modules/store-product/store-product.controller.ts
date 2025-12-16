import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { StoreProductService } from './store-product.service';
import { CreateStoreProductDto } from './dto/create-store-product.dto';
import { UpdateStoreProductDto } from './dto/update-store-product.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { StoreGuard } from '../../common/guards/store.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('store-product')
@UseGuards(JwtAuthGuard, StoreGuard)
export class StoreProductController {
  constructor(private readonly storeProductService: StoreProductService) {}

  @Post()
  create(
    @Body() createStoreProductDto: CreateStoreProductDto,
    @CurrentUser('storeId') storeId: string,
  ) {
    // Asegurar que el storeId del DTO coincida con el del usuario logueado
    return this.storeProductService.create({
      ...createStoreProductDto,
      storeId: +storeId,
    });
  }

  @Get()
  findAll(@CurrentUser('storeId') storeId: string) {
    return this.storeProductService.findByStore(+storeId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storeProductService.findOne(+id);
  }

  @Get('store/:storeId')
  findByStore(@Param('storeId') id: string) {
    return this.storeProductService.findByStore(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStoreProductDto: UpdateStoreProductDto,
  ) {
    return this.storeProductService.update(+id, updateStoreProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storeProductService.remove(+id);
  }
}
