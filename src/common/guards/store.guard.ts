import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtPayload } from './jwt-auth.guard';

@Injectable()
export class StoreGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as JwtPayload;

    if (!user || user.type !== 'store' || !user.storeId) {
      throw new ForbiddenException('Access denied. Store user required.');
    }

    return true;
  }
}
