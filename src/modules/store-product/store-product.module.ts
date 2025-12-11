import { Module } from '@nestjs/common';
import { StoreProductService } from './store-product.service';
import { StoreProductController } from './store-product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature(Object.values(entities))],
  controllers: [StoreProductController],
  providers: [StoreProductService],
})
export class StoreProductModule {}
