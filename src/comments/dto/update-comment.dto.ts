import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty()
  @IsString()
  @Length(1, 8000)
  content: string;
}
