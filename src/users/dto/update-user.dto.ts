import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { OmitType } from '@nestjs/mapped-types';


export class UpdateUserDto extends PartialType(OmitType( CreateUserDto,["pseudo"])) {} /* OmitType = on ne veut pas update le pseudo */ 

/* PartialType prend toute la CreateUserDto et met le tout en optionnel pour UpdateUserDto = Raccourci*/
