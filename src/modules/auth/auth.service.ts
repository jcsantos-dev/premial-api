/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UserAuthService } from '../user-auth/user-auth.service';
import { UserService } from '../user/user.service';
import { UserCustomerService } from '../user-customer/user-customer.service';
import { UserStoreService } from '../user-store/user-store.service';

interface JwtPayload {
  sub: string;
  email: string;
  type: 'customer' | 'store_user' | 'unknown';
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userAuthService: UserAuthService,
    private readonly userService: UserService,
    private readonly userCustomerService: UserCustomerService,
    private readonly userStoreService: UserStoreService,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<{
    access_token: string;
    user: {
      id: string;
      name: string;
      email: string;
      type: string;
    };
  }> {
    const userAuth = await this.userAuthService.findByEmail(email);
    if (!userAuth) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!userAuth.passwordHash) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 👇 bcrypt.compare debe ser async y awaited
    const valid = await bcrypt.compare(password, userAuth.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const user = await this.userService.findOne(userAuth.userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const isCustomer = await this.userCustomerService.existsByUserId(user.id);
    const isStoreUser = await this.userStoreService.existsByUserId(user.id);

    const type: JwtPayload['type'] = isCustomer
      ? 'customer'
      : isStoreUser
        ? 'store_user'
        : 'unknown';

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      type,
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        type,
      },
    };
  }
}
