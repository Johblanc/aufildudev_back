import { ApiProperty } from "@nestjs/swagger/dist";
import { IsString ,IsArray,IsOptional} from "class-validator";

export class CreateArticleDto {

    @ApiProperty()
    @IsString()
    title : string ;

    @ApiProperty()
    @IsString()
    content : string ;

    @ApiProperty()
    @IsArray()
    @IsOptional()
    requirements : number[] ;
}
