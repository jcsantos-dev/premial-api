import { Module } from '@nestjs/common';
import { LevelTypesService } from './level-types.service';
import { LevelTypesController } from './level-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature(Object.values(entities))],
  controllers: [LevelTypesController],
  providers: [LevelTypesService],
})
export class LevelTypesModule {}
