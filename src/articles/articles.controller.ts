import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, NotFoundException, BadRequestException, UseGuards, Request, } from '@nestjs/common';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guards';
import { CategoriesService } from 'src/categories/categories.service';
import { Category } from 'src/categories/entities/category.entity';
import { Framework } from 'src/frameworks/entities/framework.entity';
import { FrameworksService } from 'src/frameworks/frameworks.service';
import { Language } from 'src/languages/entities/language.entity';
import { LanguagesService } from 'src/languages/languages.service';
import { User } from 'src/users/entities/user.entity';
import { In } from 'typeorm';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';

@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService ,
    private readonly languagesService: LanguagesService ,
    private readonly categoriesService : CategoriesService ,
    private readonly frameworksService : FrameworksService
    ) {}

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
    
    const languagesList = await this.languagesService.findManyLanguage(languages)
    if (languagesList.length < 1) {
      throw new BadRequestException("Il faut au moins un langage valide") 
    }
    
    const categoriesList = await this.categoriesService.findManyCategories(categories)
    if (categoriesList.length < 1) {
      throw new BadRequestException("Il faut au moins une categorie valide") 
    }

    const frameworksList = await this.frameworksService.findManyFramework(frameworks)


    const requirementsList = await this.articlesService.findIds(requirements)

    const data = await this.articlesService.create({
      ...base,
      user : user,
      requirements :requirementsList,
      languages : languagesList,
      categories : categoriesList,
      frameworks : frameworksList
    })
    return {
      message : "L'article a bien été créé",
      data : data }
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

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto, @GetUser() user : User) {
    
    const { requirements, languages, categories, frameworks,...base} = updateArticleDto ;
    const isExist = await this.articlesService.findOne(+id)
    if (isExist === null ){
      throw new NotFoundException("Cette article n'existe pas")
    }
    let languagesList : Language[] = []
    if (languages){
      languagesList = await this.languagesService.findManyLanguage(languages)
      if (languagesList.length < 1) {
        throw new BadRequestException("Il faut au moins un langage valide") 
      }
    }
    
    let categoriesList : Category[] = []
    if (categories){
      categoriesList = await this.categoriesService.findManyCategories(categories)
      if (categoriesList.length < 1) {
        throw new BadRequestException("Il faut au moins une categorie valide") 
      }
    }
    
    let frameworksList : Framework[] = []
    if (frameworks){
      frameworksList = await this.frameworksService.findManyFramework(frameworks)
    }
    
    let requirementsList : Article[] = []
    if (requirements){
      requirementsList = (
        await this.articlesService.findIds(requirements)
      )
      .filter(item => item.id !== +id);
    }

    return  {
      message : "Modification d'un article",
      data : (await this.articlesService.update(+id, {
        ...base ,
        languages    : languages    ? languagesList    : undefined ,
        categories   : categories   ? categoriesList   : undefined ,
        frameworks   : frameworks   ? frameworksList   : undefined ,
        requirements : requirements ? requirementsList : undefined ,

      }) )
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const isExist = await this.articlesService.findOne(+id)
    if (isExist === null ){
      throw new NotFoundException("Cette article n'existe pas")
    }
    return  {
      message : "Suppression d'un article",
      data : await this.articlesService.remove(+id) 
    }
  }
}
