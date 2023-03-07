import { IsNotEmpty, IsString, IsNumber } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class PromoAdminDto  {    
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    pseudo : string

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    access_lvl : number
}