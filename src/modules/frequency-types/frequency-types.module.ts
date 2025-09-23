import { Module } from '@nestjs/common';
import { FrequencyTypesService } from './frequency-types.service';
import { FrequencyTypesController } from './frequency-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature(Object.values(entities))],
  controllers: [FrequencyTypesController],
  providers: [FrequencyTypesService],
})
export class FrequencyTypesModule {}
