import { Module } from '@nestjs/common';
import { UserLevelService } from './user-level.service';
import { UserLevelController } from './user-level.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature(Object.values(entities))],
  controllers: [UserLevelController],
  providers: [UserLevelService],
})
export class UserLevelModule {}
