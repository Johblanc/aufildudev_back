import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PromoAdminDto } from './dto/promo-admin.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  //Service du create user : 
  async create(createUserDto: CreateUserDto) {
    const user = await User.create({ ...createUserDto }).save();
    return user;
  }

  async findOneById(id: number) {
    return await User.findOneBy({ id: id })
  }

  async findOneByPseudo(pseudo: string) {
    return await User.findOneBy({ pseudo: pseudo })
  }

  async findOneByMail(email: string) {
    return await User.findOneBy({ email: email })
  }

  //Service pour modifier l'email et/ou le password de l'user :
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    const user = await User.findOneBy({ id });
if (user) {
      user.email = updateUserDto.email;
      user.password = updateUserDto.password;
      return await user.save();
    }
    return null;
  }

  //Service pour
  async promoteUser(promoteAdminDto: PromoAdminDto): Promise<User | null> {
    const user = await this.findOneByPseudo(promoteAdminDto.pseudo)

    if (user !== null) {
      user.access_lvl = promoteAdminDto.access_lvl;

      return await user.save();
    }
    return null;
  }
}