import { Module } from '@nestjs/common';
import { StreakTypesService } from './streak-types.service';
import { StreakTypesController } from './streak-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature(Object.values(entities))],
  controllers: [StreakTypesController],
  providers: [StreakTypesService],
})
export class StreakTypesModule {}
