import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    pseudo : string

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email : string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password : string
}
