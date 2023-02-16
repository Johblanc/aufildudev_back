import { ApiProperty } from "@nestjs/swagger/dist";
import { IsString } from "class-validator";

export class CreateArticleDto {

    @ApiProperty()
    @IsString()
    title : string ;

    @ApiProperty()
    @IsString()
    content : string ;
}
