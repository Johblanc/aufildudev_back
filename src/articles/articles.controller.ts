import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, NotFoundException, BadRequestException, } from '@nestjs/common';
import { Category } from 'src/categories/entities/category.entity';
import { Framework } from 'src/frameworks/entities/framework.entity';
import { Language } from 'src/languages/entities/language.entity';
import { User } from 'src/users/entities/user.entity';
import { In } from 'typeorm';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  async create(@Body() createArticleDto: CreateArticleDto) {
    const { requirements, languages, categories, frameworks,...base} = createArticleDto ;
    const userId = 1 ; // A FAIRE ---> Vérifiction du User dans le token
    const isExist = await this.articlesService.findOneByName(createArticleDto.title)
    if (isExist)
    {
      throw new ConflictException("Ce titre est déjà pris")
    }
    // A FAIRE ---> Vérifiction du User dans le token
    //const user = await this.usersService.findOne(userId)
    const user = await User.findOneBy({id : userId})
    if (user === null){
      throw new ConflictException("Ce user n'existe pas")
    }
    /*
    // A FAIRE ---> Recupération de la liste des langages
    const languagesList = await this.languagesService.findIds(languages)
    if (languagesList.lenght < 1) {
      throw new BadRequestException("Il faut au moins un langage valide") 
    }
    */
    const languagesList = await Language.findBy({id : In(languages)})
    /*
    // A FAIRE ---> Recupération de la liste des categories
    const categoriesList = await this.categoriesService.findIds(categories)
    if (categoriesList.lenght < 1) {
      throw new BadRequestException("Il faut au moins une categorie valide") 
    }
    */
    const categoriesList = await Category.findBy({id : In(categories)})
    /*
    // A FAIRE ---> Recupération de la liste des frameworks
    const frameworksList = await this.frameworksService.findIds(frameworks)
    */
    const frameworksList = await Framework.findBy({id : In(frameworks)})

    const requirementsList = await this.articlesService.findIds(requirements);

    return {
      message : "L'article a bien été créé",
      data : await this.articlesService.create({
      ...base,
      user : user,
      requirements :requirementsList,
      languages : languagesList,
      categories : categoriesList,
      frameworks : frameworksList
    }) }
  }

  @Get()
  async findAll() {
    return {
      message : "Liste de tous les articles",
      data :(await this.articlesService.findAll()).map(item => item.asObject())
    } ;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return  {
      message : "Récupération d'un article",
      data : (await this.articlesService.findOne(+id))?.asObject() 
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return  {
      message : "Modification d'un article",
      data : await this.articlesService.update(+id, updateArticleDto) 
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return  {
      message : "Suppression d'un article",
      data : await this.articlesService.remove(+id) 
    }
  }
}
