import { Module } from '@nestjs/common';
import { UserLoyaltyService } from './user-loyalty.service';
import { UserLoyaltyController } from './user-loyalty.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature(Object.values(entities))],
  controllers: [UserLoyaltyController],
  providers: [UserLoyaltyService],
})
export class UserLoyaltyModule {}
