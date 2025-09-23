import { Module } from '@nestjs/common';
import { UserLoyaltyLogService } from './user-loyalty-log.service';
import { UserLoyaltyLogController } from './user-loyalty-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature(Object.values(entities))],
  controllers: [UserLoyaltyLogController],
  providers: [UserLoyaltyLogService],
})
export class UserLoyaltyLogModule {}
