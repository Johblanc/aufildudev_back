import { PartialType } from '@nestjs/mapped-types';
import { IsDate, IsString, Length } from 'class-validator';
import { CreateCommentDto } from './create-comment.dto';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @IsString()
  @Length(1, 8000)
  content: string;
}
