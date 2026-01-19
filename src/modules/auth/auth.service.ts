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
  type: 'customer' | 'store' | 'platform';
  storeId?: string;
  storeName?: string;
  roleId?: string;
  userStoreId?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userAuthService: UserAuthService,
    private readonly userService: UserService,
    private readonly userCustomerService: UserCustomerService,
    private readonly userStoreService: UserStoreService,
    private readonly jwtService: JwtService,
  ) { }

  async login(
    email: string,
    password: string,
  ): Promise<{
    access_token: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone?: string;
      firstName?: string;
      lastName?: string;
      type: string;
      storeId?: string;
      storeName?: string;
      roleId?: string;
      userStoreId?: string;
    };
  }> {
    // 1. Buscar usuario por email en la tabla User
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 2. Buscar auth usando el user.id encontrado
    const userAuth = await this.userAuthService.findByUserId(user.id);
    if (!userAuth || !userAuth.passwordHash) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 3. Verificar password
    const valid = await bcrypt.compare(password, userAuth.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isCustomer = await this.userCustomerService.existsByUserId(user.id);
    const userStore = await this.userStoreService.findByUserId(user.id);

    let type: JwtPayload['type'] = 'customer';
    let storeId: string | undefined;
    let storeName: string | undefined;
    let roleId: string | undefined;
    let userStoreId: string | undefined;

    if (userStore) {
      type = 'store';
      storeId = userStore.storeId;
      storeName = (userStore as any).store?.name;
      roleId = userStore.role?.id;
      userStoreId = userStore.id;
    } else if (isCustomer) {
      type = 'customer';
    } else {
      // Platform user - puedes agregar lógica aquí si es necesario
      type = 'platform';
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      type,
      storeId,
      storeName,
      roleId,
      userStoreId,
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        type,
        storeId,
        storeName,
        roleId,
        userStoreId,
      },
    };
  }
}
