import { Controller, Post, UseInterceptors, Request, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { LocalAuthGuard } from './local-auth.guards';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('users')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly usersService: UsersService,
        private authService: AuthService
    ) { }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req: any) {
        return this.authService.login(req.user);
    }
}
