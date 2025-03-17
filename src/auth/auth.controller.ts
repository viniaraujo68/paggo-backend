import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async signIn(@Body() body: { name: string; password: string }) {
    const { name, password } = body;
    return this.authService.signIn(name, password);
  }

  @Post('register')
  async register(@Body() body: { name: string; password: string }) {
	const { name, password } = body;
    return this.authService.register(name, password);
  }
}