import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service'; /* Processus d'identification */
import { JwtService } from '@nestjs/jwt'; /* Pour le token */

@Module({
  controllers: [UsersController],
  providers: [UsersService, AuthService, JwtService] /* "Providers" = les fournisseurs des controllers */
})
export class UsersModule {} /* à ne pas oublier */
