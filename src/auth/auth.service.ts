import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}



  /** Pour SE LOGIN, avec le auth.controller.ts et le local.strategy.ts */

  async validateUser(pseudo: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByPseudo(pseudo);

    if (user === null) {
      throw new NotFoundException('Veuillez écrire un pseudo existant.');
    }
    const isMatch = await bcrypt.compare(pass, user.password);

    if (isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = { pseudo: user.pseudo, sub: user.id };

    return {
      message: 'Login Ok',
      data: { access_token: this.jwtService.sign(payload), ...user },
    };
  }
}
