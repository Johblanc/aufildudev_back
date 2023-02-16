import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { IsNull,In } from 'typeorm';
import { Requierment } from 'src/requierments/entities/requierment.entity';

@Injectable()
export class ArticlesService {
  async create(createArticleDto: CreateArticleDto) {
    const article =  new Article()
    article.title = createArticleDto.title ;
    article.content = createArticleDto.content ;
    await article.save()
    const requierments = await Article.findBy({id : In(createArticleDto.requirements)})
    requierments.forEach(async item => {
      await Requierment.create({article : article, article_needed : item}).save()
    })
    return await article.save();
  }

  async findAll() {
    return await Article.findBy({ deleted_at : IsNull() });
  }

  findOne(id: number) {
    return `This action returns a #${id} article`;
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }
}
