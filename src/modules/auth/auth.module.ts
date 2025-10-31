import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserAuthModule } from '../user-auth/user-auth.module';
import { UserModule } from '../user/user.module';
import { UserCustomerModule } from '../user-customer/user-customer.module';
import { UserStoreModule } from '../user-store/user-store.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UserAuthModule,
    UserModule,
    UserCustomerModule,
    UserStoreModule,
    PassportModule,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'supersecret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
