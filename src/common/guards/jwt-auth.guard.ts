import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export interface JwtPayload {
  sub: string;
  email: string;
  type: 'customer' | 'store' | 'platform';
  storeId?: string;
  roleId?: string;
  userStoreId?: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromRequest(request);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SECRET || 'supersecret',
      });

      // Agregar el payload al request para que esté disponible en los decorators
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }

  private extractTokenFromRequest(request: Request): string | undefined {
    // Primero intentar del header Authorization (Prioridad)
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type === 'Bearer' && token) {
      return token;
    }

    // Si no está en header, intentar obtener de las cookies
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const tokenFromCookie = request.cookies?.['access_token'];
    if (tokenFromCookie) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return tokenFromCookie;
    }

    return undefined;
  }
}
