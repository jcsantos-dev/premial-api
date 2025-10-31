import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({ type: LoginDto }) // 👈 esto hace que Swagger muestre los campos
  async login(
    @Body() { email, password }: { email: string; password: string },
  ) {
    return this.authService.login(email, password);
  }
}
