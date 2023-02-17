import { IsNumber, IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @Length(1, 8000)
  content: string;

  @IsNumber()
  article_id: number;
}
