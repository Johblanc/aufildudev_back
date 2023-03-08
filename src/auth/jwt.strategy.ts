import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { NotFoundException } from '@nestjs/common/exceptions';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {      /* export pour l'aut.module.ts */
  constructor( 
    private readonly usersService: UsersService
    ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWTCONSTANTS,
    });
  }

  // Retourne le User
  async validate(payload: any) {
    const user = await this.usersService.findOneById(payload.sub)
    if (user === null) {
      throw new NotFoundException("Vous n'êtes pas dans la base de données")
    }

    return user;
  }
}
