import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService, 
    private usersService : UsersService) {
    super({usernameField: 'pseudo',});
    
  }

  async validate(pseudo: string, password: string): Promise<User> {
    
    const isUserExist = await this.usersService.findOneByPseudo(pseudo)
    
    if (!isUserExist) throw new BadRequestException("Pseudo incorrect.")
    const user = await this.authService.validateUser(pseudo, password);  /* Grâce à l'auth.service.ts */
    if (!user) {
      throw new UnauthorizedException();
    }
    return user ;
  }
}