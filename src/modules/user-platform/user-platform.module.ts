import { Module } from '@nestjs/common';
import { UserPlatformService } from './user-platform.service';
import { UserPlatformController } from './user-platform.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature(Object.values(entities))],
  controllers: [UserPlatformController],
  providers: [UserPlatformService],
})
export class UserPlatformModule {}
