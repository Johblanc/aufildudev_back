import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, NotFoundException, BadRequestException, UseGuards, Request, ForbiddenException, ClassSerializerInterceptor, UseInterceptors, } from '@nestjs/common';
import { GetAuthor } from 'src/auth/get-author.decorator';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guards';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/roles.enum';
import { RolesGuard } from 'src/auth/roles/roles.guard';
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

  /**
   * Création d'un nouvel **Article**
   * @param createArticleDto  propriétés du nouvel **Article**
   * @param user              le **User** effectuant la requete
   * @param isPublic          l'**Article** est-il publique ou privé
   * @returns                 le nouvel **Article**
   */
  async create( createArticleDto: CreateArticleDto, user : User, isPublic : boolean = false ) 
  {
    /** Déconstruction de la Dto */
    const { requirements, languages, categories, frameworks,...base} = createArticleDto ;

    /** Vérification que le titre est unique */
    const isExist = await this.articlesService.findOneByTitle(createArticleDto.title)
    if (isExist)
    {
      throw new ConflictException("Ce titre est déjà pris")
    }
    
    /** Récupération de la liste des **Langages** liés à l'**Article** */
    const languagesList = await this.languagesService.findManyLanguage(languages)
    if (languagesList.length < 1) {
      throw new BadRequestException("Il faut au moins un langage valide") 
    }
    
    /** Récupération de la liste des **Catégories** liées à l'**Article** */
    const categoriesList = await this.categoriesService.findManyCategories(categories)
    if (categoriesList.length < 1) {
      throw new BadRequestException("Il faut au moins une categorie valide") 
    }

    /** Récupération de la liste des **FrameWorks** liés à l'**Article** */
    const frameworksList = await this.frameworksService.findManyFramework(frameworks)

    /** Récupération de la liste des **Articles prérequis** liés à l'**Article** */
    const requirementsList = await this.articlesService.findManyByIds(requirements)

    /** Création du nouvel **Article** */
    const newArticle = await this.articlesService.create({
      ...base,
      user : user,
      requirements :requirementsList,
      languages : languagesList,
      categories : categoriesList,
      frameworks : frameworksList ,
      isPublic : isPublic
    })
    return newArticle 
  }

  /**
   * Demande de création d'un nouvel **Article** privé
   * @param createArticleDto  propriétés du nouvel **Article**
   * @param user              le **User** effectuant la requete
   * @returns                 le nouvel **Article**
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async createPrivate(@Body() createArticleDto: CreateArticleDto, @GetUser() user : User) 
  {
    const data = await this.create(createArticleDto,user)
    return {
      message : "L'article a bien été créé",
      data : data }
  }

  /**
   * Demande de création d'un nouvel **Article** publique
   * @param createArticleDto  propriétés du nouvel **Article**
   * @param user              le **User** effectuant la requete
   * @returns                 le nouvel **Article**
   */
  @UseGuards(JwtAuthGuard)
  @Post("public")
  async createPublic(@Body() createArticleDto: CreateArticleDto, @GetUser() user : User) 
  {
    const data = await this.create(createArticleDto,user,true)
    return {
      message : "L'article a bien été créé",
      data : data }
  }

  @UseGuards(JwtAuthGuard)
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
      data : (await this.articlesService.findOneById(+id))?.asObject() 
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto, @GetUser() user : User) {
    
    const { requirements, languages, categories, frameworks,...base} = updateArticleDto ;
    const isExist = await this.articlesService.findOneById(+id)
    if (isExist === null ){
      throw new NotFoundException("Cette article n'existe pas")
    }

    if ( isExist.user.id !== user.id ){
      throw new ForbiddenException("Vous n'etes pas le propriétaire de cette article")
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
        await this.articlesService.findManyByIds(requirements)
      )
      .filter(item => item.id !== +id);
    }

    const updateData = {
      ...base ,
      languages    : languages    ? languagesList    : undefined ,
      categories   : categories   ? categoriesList   : undefined ,
      frameworks   : frameworks   ? frameworksList   : undefined ,
      requirements : requirements ? requirementsList : undefined ,

    }

    return  {
      message : "Modification d'un article",
      data : (await this.articlesService.update(+id, updateData) )?.asObject()
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const isExist = await this.articlesService.findOneById(+id)
    if (isExist === null ){
      throw new NotFoundException("Cette article n'existe pas")
    }
    return  {
      message : "Suppression d'un article",
      data : (await this.articlesService.remove(+id))?.asObject()
    }
  }
}
