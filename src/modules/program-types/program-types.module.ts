import { Module } from '@nestjs/common';
import { ProgramTypesService } from './program-types.service';
import { ProgramTypesController } from './program-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { ProgramType } from '../../entities/ProgramType';
import { entities } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature(Object.values(entities))],
  controllers: [ProgramTypesController],
  providers: [ProgramTypesService],
})
export class ProgramTypesModule {}
