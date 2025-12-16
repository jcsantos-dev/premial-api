import { Module } from '@nestjs/common';
import { ModuleTypeService } from './module_type.service';
import { ModuleTypeController } from './module_type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature(Object.values(entities))],
  controllers: [ModuleTypeController],
  providers: [ModuleTypeService],
})
export class ModuleTypeModule {}
