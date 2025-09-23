import { Module } from '@nestjs/common';
import { RewardTypesService } from './reward-types.service';
import { RewardTypesController } from './reward-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature(Object.values(entities))],
  controllers: [RewardTypesController],
  providers: [RewardTypesService],
})
export class RewardTypesModule {}
