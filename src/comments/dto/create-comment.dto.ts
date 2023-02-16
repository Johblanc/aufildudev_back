import { IsNumber, IsString, Length } from 'class-validator';
import { Article } from 'src/articles/entities/article.entity';

export class CreateCommentDto {
  @IsString()
  @Length(1, 8000)
  content: string;

  @IsNumber()
  @Length(1)
  article_id: Article;
}
