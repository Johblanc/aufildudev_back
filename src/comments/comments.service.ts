import { Injectable } from '@nestjs/common';
import { Article } from 'src/articles/entities/article.entity';
import { User } from 'src/users/entities/user.entity';
import { IsNull } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  //Récupération de l'id user via token à add
  async create(
    createCommentDto: CreateCommentDto,
    user: User,
  ): Promise<Comment | null> {
    const article = await Article.findOneBy({
      id: createCommentDto.article_id,
      deleted_at: IsNull(),
    });

    if (article !== null) {
      const comment = new Comment();
      comment.content = createCommentDto.content;
      comment.article = article;
      comment.user = user;

      await comment.save();

      return await Comment.findOne({
        relations: { article: true, user: true },
        select: {
          id: true,
          content: true,
          article: { id: true, title: true },
          user: { id: true, pseudo: true },
        },
        where: { id: comment.id },
      });
    }
    return null;
  }

  async findAll(): Promise<Comment[] | null> {
    return await Comment.find({
      relations: { article: true, user: true },
      select: {
        id: true,
        content: true,
        created_at: true,
        updated_at: true,
        article: { id: true, title: true },
        user: { pseudo: true },
      },
      where: { deleted_at: IsNull() },
      order: { id: 'DESC' },
    });
  }
  //Récupération de l'id user via token à add
  async findOne(id: number): Promise<Comment | null> {
    console.log('Récupération de lid user via token à add');
    return await Comment.findOne({
      relations: { article: true },
      select: { id: true, content: true, article: { id: true, title: true } },
      where: { id: id, deleted_at: IsNull() },
    });
  }

  async getArticleById(id: number): Promise<Comment[] | null> {
    return await Comment.find({
      relations: { article: true },
      select: { id: true, content: true, article: { id: true, title: true } },
      where: { article: { id: id, deleted_at: IsNull() } },
      order: { created_at: 'DESC' },
    });
  }
  //Récupération de l'id user via token à add
  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment | null> {
    console.log(id);
    const newComment = await Comment.findOne({
      where: { id: id, deleted_at: IsNull() },
    });
    if (newComment !== null) {
      newComment.content = updateCommentDto.content;

      await newComment.save();

      return await Comment.findOne({
        relations: { article: true, user: true },
        select: {
          id: true,
          content: true,
          created_at: true,
          updated_at: true,
          article: { id: true, title: true },
          user: { pseudo: true },
        },
        where: { id: id, deleted_at: IsNull() },
      });
    }
    return null;
  }
  //Récupération de l'id user via token à add
  async remove(id: number): Promise<Comment | null> {
    console.log('Récupération de lid user via token à add');
    const deleteComment = await Comment.findOne({
      where: { id: id, deleted_at: IsNull() },
    });
    if (deleteComment !== null) {
      deleteComment.deleted_at = new Date();

      await deleteComment.save();

      return await Comment.findOne({
        relations: { article: true },
        select: {
          id: true,
          content: true,
          article: { id: true, title: true },
          deleted_at: true,
        },
        where: { id: id },
      });
    }
    return null;
  }
}
