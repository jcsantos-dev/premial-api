import { Module } from '@nestjs/common';
import { UserStreakService } from './user-streak.service';
import { UserStreakController } from './user-streak.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature(Object.values(entities))],
  controllers: [UserStreakController],
  providers: [UserStreakService],
})
export class UserStreakModule {}
