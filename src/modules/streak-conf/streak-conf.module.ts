import { Module } from '@nestjs/common';
import { StreakConfService } from './streak-conf.service';
import { StreakConfController } from './streak-conf.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature(Object.values(entities))],
  controllers: [StreakConfController],
  providers: [StreakConfService],
})
export class StreakConfModule {}
