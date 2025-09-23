import { Module } from '@nestjs/common';
import { UserStoreService } from './user-store.service';
import { UserStoreController } from './user-store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature(Object.values(entities))],
  controllers: [UserStoreController],
  providers: [UserStoreService],
})
export class UserStoreModule {}
