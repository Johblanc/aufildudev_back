import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { IsNull,In } from 'typeorm';
import { Requierment } from 'src/requierments/entities/requierment.entity';
import { User } from 'src/users/entities/user.entity';
import { Language } from 'src/languages/entities/language.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Framework } from 'src/frameworks/entities/framework.entity';

@Injectable()
export class ArticlesService {
  async create(data : {
    user : User , 
    title : string, 
    content : string, 
    requirements : Article[] ,
    languages : Language[] ,
    categories : Category[] ,
    frameworks : Framework[] ,
  }) 
  {
    const { requirements , ...creatObject} = data
    const article = await Article.create({...creatObject}).save()
    
    requirements.forEach(async item => {
      await Requierment.create({article : article, article_needed : item}).save()
    })
    
    return await this.findOne(article.id); 
  }

  async findAll() {
    return await Article.find({
      where : {
        deleted_at : IsNull()
      },
      relations :{
        user : true,
        languages : true,
        categories : true,
        frameworks : true,
        needed_for : { article : true },
        requirements : { article_needed : true }
      }
    });
  }

  async findIds(ids: number[]) {
    return await Article.findBy({ id : In(ids), deleted_at : IsNull() });
  }

  async findOne(id: number) { 
    return await Article.findOne({
      where : {
        id : id,
        deleted_at : IsNull()
      },
      relations :{
        user : true,
        languages : true,
        categories : true,
        frameworks : true,
        needed_for : { article : true },
        requirements : { article_needed : true }
      }
    });
  }

  async findOneByName(title: string) {
    return await Article.findOneBy({title : title});
  }

  async update(id: number, data : {
    title? : string, 
    content? : string, 
    requirements? : Article[] ,
    languages? : Language[] ,
    categories? : Category[] ,
    frameworks? : Framework[] ,
  }) 
  {
    const article = await Article.findOneBy({id:id})

    if ( article !== null ){
      data.title          && (article.title = data.title) ;
      data.content        && (article.content = data.content) ;
      data.languages      && (article.languages = data.languages) ;
      data.categories     && (article.categories = data.categories) ;
      data.frameworks     && (article.frameworks = data.frameworks) ;
      data.requirements   && (article.requirements = []) ;
      await article.save()
      
      if (data.requirements){
        data.requirements.forEach(async item => {
          await Requierment.create({article : article, article_needed : item}).save()
        })
        return await this.findOne(article.id);
      }
    }
    return null;
  }

  async remove(id: number) {
    return await (await Article.findOneBy({id}))?.remove();
  }
}
