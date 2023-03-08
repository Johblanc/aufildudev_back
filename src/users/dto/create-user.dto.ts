
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty() /* Pour swagger */
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
