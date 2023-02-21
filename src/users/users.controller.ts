import { Controller, Get, ValidationPipe, Post, Body, Patch, Param, Delete, ConflictException, UsePipes} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService
  ) { }

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Body() createUserDto: CreateUserDto) {
    const userExist = await this.usersService.findOneByMail(createUserDto.email);

    if (userExist) {
      throw new ConflictException("Ce mail est déjà enregistré.");
    }

    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

    const data = await this.usersService.create(createUserDto);
    return {
      statusCode: 201,
      message: `${createUserDto.pseudo} utilisateur enregistré`,
      succes: 'Created',
      data: data,
    };
  }

  /* @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))

  async login(@Request() req: any) {
    const user = await this.usersService.findOneByMail(req.body.mail)
    if (!user) {
      throw new NotFoundException("Cet utilisateur n'existe pas.")
    }
    return this.authService.login(user);
  } */


  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
