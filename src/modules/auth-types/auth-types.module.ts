import { Module } from '@nestjs/common';
import { AuthTypesService } from './auth-types.service';
import { AuthTypesController } from './auth-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature(Object.values(entities))],
  controllers: [AuthTypesController],
  providers: [AuthTypesService],
})
export class AuthTypesModule {}
