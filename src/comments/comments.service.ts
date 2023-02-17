import { Injectable } from '@nestjs/common';
import { Article } from 'src/articles/entities/article.entity';
import { IsNull } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  //Récupération de l'id user via token à add
  async create(createCommentDto: CreateCommentDto): Promise<Comment | null> {
    console.log('Récupération de lid user via token à add');

    const article = await Article.findOneBy({
      id: createCommentDto.article_id,
      deleted_at: IsNull(),
    });

    if (article !== null) {
      const comment = new Comment();
      comment.content = createCommentDto.content;
      comment.article = article;
      await comment.save();

      return await Comment.findOne({
        relations: { article: true },
        select: {
          id: true,
          content: true,
          article: { id: true, title: true },
        },
        where: { id: comment.id },
      });
    }
    return null;
  }

  async findAll(): Promise<Comment[] | null> {
    const allComments = await Comment.find({
      relations: { article: true },
      select: { id: true, content: true, article: { id: true, title: true } },
      where: { deleted_at: IsNull() },
    });

    return allComments;
  }
  //Récupération de l'id user via token à add
  async findOne(id: number): Promise<Comment | null> {
    console.log('Récupération de lid user via token à add');
    return await Comment.findOne({
      relations: { article: true },
      select: { id: true, content: true, article: { id: true, title: true } },
      where: { id: id },
    });
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
