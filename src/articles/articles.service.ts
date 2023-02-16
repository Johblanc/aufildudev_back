import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { IsNull,In } from 'typeorm';
import { Requierment } from 'src/requierments/entities/requierment.entity';

@Injectable()
export class ArticlesService {
  async create(userId : number , title : string, content : string, requirements : number[] ) {
    const article =  new Article()
    article.title = title ;
    article.content = content ;
    await article.save()
    
    const requierments = await Article.findBy({id : In(requirements)})
    requierments.forEach(async item => {
      await Requierment.create({article : article, article_needed : item}).save()
    })
    
    return await this.findOne(article.id); 
  }

  async findAll() {
    return await Article.findBy({ deleted_at : IsNull() });
  }

  async findOne(id: number) { 
    return await Article.findOneBy({id : id});
  }

  async findOneByName(title: string) {
    return await Article.findOneBy({title : title});
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  async remove(id: number) {
    return `This action removes a #${id} article`;
  }
}
