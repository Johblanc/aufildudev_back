import { Controller, Request, UseGuards, Get } from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guards';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth-guards';

@Controller()
export class AppController {

  constructor(private authService: AuthService) { }

}