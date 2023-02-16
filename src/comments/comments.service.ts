import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  //Récupération de l'id user via token à add
  async create(createCommentDto: CreateCommentDto): Promise<any> {
    console.log('Récupération de lid user via token à add');

    const comment = new Comment();
    comment.content = createCommentDto.content;
    comment.article = createCommentDto.article_id;

    await comment.save();

    return comment.article.title;
  }

  findAll() {
    return `This action returns all comments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
