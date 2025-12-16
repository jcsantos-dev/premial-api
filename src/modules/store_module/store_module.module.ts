import { Module } from '@nestjs/common';
import { StoreModuleService } from './store_module.service';
import { StoreModuleController } from './store_module.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature(Object.values(entities))],
  controllers: [StoreModuleController],
  providers: [StoreModuleService],
})
export class StoreModuleModule {}
