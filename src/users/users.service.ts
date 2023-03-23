import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto'; /* Dto = Data transfer object*/
import { PromoAdminDto } from './dto/promo-admin.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  /** Pour S'ENREGISTRER (dans le Controller) */

  async findOneByMail(email: string) {
    return await User.findOneBy({
      email: email,
    }); /* Comparer l'email communiqué par l'utilisateur... */
  }

  async create(createUserDto: CreateUserDto) {
    const user = await User.create({
      ...createUserDto,
    }).save(); /*... S'il n'existe pas déjà (Controller), créer un nouvel utilisateur */
    return user;
  }

  /** Pour S'UPDATE (dans le Controller) */

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    const user = await User.findOneBy({ id });
    if (user !== null) {
      if (updateUserDto.email)
        user.email =
          updateUserDto.email; /* Si la Dto (le front) change l'email, alors... */
      //if (updateUserDto.password) user.password = updateUserDto.password ;  /* Si la Dto change le password, alors... */

      return await user.save(); /* Sauvegarde la modification */
    }
    return null;
  }

  /** Pour VERIFIER l'administrateur par son ID ou VERIFIER un user par son ID dans jwt.strategy.ts par exemple */

  async findOneById(id: number) {
    return await User.findOneBy({ id: id });
  }

  /** Pour TROUVER (admin) un utilisateur par son pseudo, le VERIFIER dans l'auth.serivce.ts ou le local.strategy.ts */

  async findOneByPseudo(pseudo: string) {
    return await User.findOneBy({ pseudo: pseudo });
  }

  /** Pour que l'administrateur TROUVE tous les utilisateurs */
  async findAllUsers() {
    const data = await User.find();
    return data;
  }

  /** Pour que l'administrateur PROMEUVE un utilisateur*/

  async promoteUser(promoteAdminDto: PromoAdminDto): Promise<User | null> {
    const user = await this.findOneByPseudo(
      promoteAdminDto.pseudo,
    ); /* Trouve l'utilisateur par son pseudo */

    if (user !== null) {
      user.access_lvl =
        promoteAdminDto.access_lvl; /* Change le niveau d'accès de l'utilisateur */

      return await user.save(); /* Sauvegarde la modification */
    }
    return null;
  }
}
