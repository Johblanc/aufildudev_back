import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guards';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth-guards';

@Controller()
export class AppController {

  constructor(private authService: AuthService) { }

  /* @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req : any) {
    return this.authService.login(req.user);
  } */



  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req : any ) {
    return req.user;
  }
}