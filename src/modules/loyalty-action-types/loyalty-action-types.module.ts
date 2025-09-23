import { Module } from '@nestjs/common';
import { LoyaltyActionTypesService } from './loyalty-action-types.service';
import { LoyaltyActionTypesController } from './loyalty-action-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature(Object.values(entities))],
  controllers: [LoyaltyActionTypesController],
  providers: [LoyaltyActionTypesService],
})
export class LoyaltyActionTypesModule {}
