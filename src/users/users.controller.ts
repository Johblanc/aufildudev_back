import { Controller, UseInterceptors, Request, Post, Body, Patch, ConflictException, UseGuards, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PromoAdminDto } from './dto/promo-admin.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guards';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService
  ) { }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const userExist = await this.usersService.findOneByMail(createUserDto.email);

    if (userExist) {
      throw new ConflictException("Ce mail est déjà enregistré.");
    }

    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

    const data = await this.usersService.create(createUserDto);
    return {
      statusCode: 201,
      message: `${createUserDto.pseudo} a bien été enregistré`,
      succes: 'Created',
      data: data,
    };
  }


  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateUser(@Body() updateUserDto: UpdateUserDto, @Request() req: any) {
    const userId = req.user.id
    updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    const user = await this.usersService.updateUser(userId, updateUserDto);

    return {
      message: "La modification a bien été enregistrée",
      data: user
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Patch("promote")
  async promoAdmin(@Body() promoteAdminDto: PromoAdminDto, @Request() req: any) {
    const adminId = req.user.id
    const admin = await this.usersService.findOneById(adminId);
    if (admin === null) {
      throw new NotFoundException("Vous n'êtes pas enregistré dans la base.")
    }

    if (admin.access_lvl < 4) {
      throw new UnauthorizedException("Vous n'avez pas le niveau d'accès requis.")
    }

    const user = await this.usersService.promoteUser(promoteAdminDto);
    if (user === null) {
      throw new NotFoundException("Cet utilisateur n'existe pas.")
    }

    return {
      message: `${user.pseudo} est passé au niveau d'acces ${user.access_lvl}`,
      data: user
    }
  }
}
