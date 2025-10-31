import { Module } from '@nestjs/common';
import { UserCustomerService } from './user-customer.service';
import { UserCustomerController } from './user-customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature(Object.values(entities))],
  controllers: [UserCustomerController],
  providers: [UserCustomerService],
  exports: [UserCustomerService], // 👈 exportamos el service
})
export class UserCustomerModule {}
