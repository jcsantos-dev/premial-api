import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginDto })
  async login(
    @Body() { email, password }: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(email, password);

    // Configurar cookie con el token JWT
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      //httpOnly: true,
      secure: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development', // Necesario para 'SameSite=None'
      sameSite: 'none', // Permite envío cross-site (Localhost -> Vercel)
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    return {
      user: result.user,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'Logged out successfully' };
  }
}
