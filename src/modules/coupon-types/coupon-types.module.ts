import { Module } from '@nestjs/common';
import { CouponTypesService } from './coupon-types.service';
import { CouponTypesController } from './coupon-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature(Object.values(entities))],
  controllers: [CouponTypesController],
  providers: [CouponTypesService],
})
export class CouponTypesModule {}
