import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty, IsString, IsNumber } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class PromoAdminDto  {    
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    pseudo : string

/* 
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email : string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password : string */

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    access_lvl : number
}