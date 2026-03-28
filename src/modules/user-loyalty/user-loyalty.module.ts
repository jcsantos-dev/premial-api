import { Module } from '@nestjs/common';
import { UserLoyaltyService } from './user-loyalty.service';
import { UserLoyaltyController } from './user-loyalty.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../../entities';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature(Object.values(entities)),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UserLoyaltyController],
  providers: [UserLoyaltyService],
})
export class UserLoyaltyModule {}
