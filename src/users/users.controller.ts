import {
  Controller,
  UseInterceptors,
  Request,
  Post,
  Body,
  Patch,
  ConflictException,
  UseGuards,
  NotFoundException,
  Get,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PromoAdminDto } from './dto/promo-admin.dto';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guards';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { ApiTags } from '@nestjs/swagger';
import { GetAdmin } from 'src/auth/get-admin.decorator';
import { User } from './entities/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@ApiTags('users') /* Pour swagger */
@Controller('users') /* Nestjs */
/* Possibilité de mettre ici le ClassSerializerInterceptor pour toute la class UsersController si nécessaire */
export class UsersController {
  constructor(
    private readonly usersService: UsersService /* Constructor de la classe UsersController */,
  ) {}

  /** S'ENREGISTRER */

  @UseInterceptors(
    ClassSerializerInterceptor,
  ) /* Cache le mot de passe pour toute cette requête */
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const mailExist = await this.usersService.findOneByMail(
      createUserDto.email,
    ); /* Compare l'email de l'utilisateur, existe-t-il déjà ? */

    if (mailExist) {
      throw new ConflictException('Ce mail est déjà enregistré.'); /* Nest */
    }

    const pseudoExist = await this.usersService.findOneByPseudo(
      createUserDto.pseudo,
    );

    if (pseudoExist)
      throw new ConflictException('Ce pseudo est déjà enregistré.');

    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      10,
    ); /* Crypte le mot de passe */

    const data = await this.usersService.create(
      createUserDto,
    ); /* Créé le nouvel utilisateur */
    return {
      message: `${createUserDto.pseudo} a bien été enregistré` /* Concatenation d'une variable dans un string littéral pour écrire le pseudo */,
      data: data /* Renvoie la data sans le mot de passe évidemment */,
    };
  }

  /** SE LOGIN = dans le auth.controller.ts */

  /** S'UPDATE */

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: User,
  ) {
    /* Exemple d'une nouvelle méthode plus rapide pour cette requête avec @GetUser() user : User */
    if (user !== null) {
      /* Vérification de l'existance */
      if (updateUserDto.password)
        updateUserDto.password = await bcrypt.hash(
          updateUserDto.password,
          10,
        ); /* Crypte le nouveau mot de passe s'il est changé dans le front (via Dto) */

      const updateUser = await this.usersService.updateUser(
        user.id,
        updateUserDto,
      ); /* Attente du UsersService */
      return {
        message: 'Votre modification a bien été enregistrée',
        data: updateUser /* Data totale modifiée */,
      };
    }
  }

  /** Pour que l'adninistrateur TROUVE tous les utilisateurs */

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('findallusers')
  async findAll(@GetAdmin() _: User) {
    const data = await this.usersService.findAllUsers();

    return {
      message: 'Liste exhaustive de tous les utilisateurs.',
      data: data,
    };
  }

  /** Pour être PROMOTE par l'administrateur */

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Patch('promote')
  async promoAdmin(
    @Body() promoteAdminDto: PromoAdminDto,
    @Request() req: any,
  ) {
    /* @Request = ancienne méthode à remplacer par @Get */
    const adminId = req.user.id;
    const admin = await this.usersService.findOneById(
      adminId,
    ); /* Vérifie que l'administrateur existe par son id grâce à UsersService */
    if (admin === null) {
      throw new NotFoundException("Vous n'êtes pas enregistré dans la base.");
    }

    if (admin.access_lvl < 4) {
      /* Vérifie le niveau requis pour l'administrateur */
      throw new UnauthorizedException(
        "Vous n'avez pas le niveau d'accès requis.",
      );
    }

    const user = await this.usersService.promoteUser(
      promoteAdminDto,
    ); /* Promeut un utilisateur grâce à UsersService */
    if (user === null) {
      throw new NotFoundException("Cet utilisateur n'existe pas.");
    }

    return {
      message: `${user.pseudo} est passé au niveau d'acces ${user.access_lvl}`,
      data: user,
    };
  }
}
