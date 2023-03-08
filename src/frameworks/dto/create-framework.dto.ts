import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateFrameworkDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string
}
