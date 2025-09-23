import { Module } from '@nestjs/common';
import { LevelConfService } from './level-conf.service';
import { LevelConfController } from './level-conf.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature(Object.values(entities))],
  controllers: [LevelConfController],
  providers: [LevelConfService],
})
export class LevelConfModule {}
