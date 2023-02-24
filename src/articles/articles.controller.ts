import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, NotFoundException, BadRequestException, UseGuards, Request, ForbiddenException, ClassSerializerInterceptor, UseInterceptors, } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetAuthor } from 'src/auth/get-author.decorator';
import { GetModerator } from 'src/auth/get-moderator.decorator';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guards';
import { CategoriesService } from 'src/categories/categories.service';
import { Category } from 'src/categories/entities/category.entity';
import { Framework } from 'src/frameworks/entities/framework.entity';
import { FrameworksService } from 'src/frameworks/frameworks.service';
import { Language } from 'src/languages/entities/language.entity';
import { LanguagesService } from 'src/languages/languages.service';
import { User } from 'src/users/entities/user.entity';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleStatus } from './emun/articles-status.emun';
import { Article } from './entities/article.entity';

/** Contôleur pour la table **Articles**
 * 
 * * **create()**           : Création d'un nouvel **Article**
 * * **createPrivate()**    : Demande de création d'un nouvel **Article** privé
 * * **createPublic()**     : Demande de création d'un nouvel **Article** publique
 * * **findAllPublic()**    : Récupération de tous les **Articles** publiques
 * * **findAllMine()**      : Récupération de tous les **Articles** d'un **User**
 * * **findAllSubmit()**    : Récupération de tous les **Articles** soumis pour validation
 * * **findOne()**          : Récupération d'un **Article**
 * * **findOnePublic()**    : Récupération d'un **Article** publique
 * * **update()**           : Modication d'un **Article**
 * * **submit()**           : Soumettre un **Article** pour validation
 * * **validate()**         : Validation d'un **Article**
 * * **delete()**           : Suppression d'un **Article**
 */
@Controller('articles')
@ApiTags("Articles")
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService ,
    private readonly languagesService: LanguagesService ,
    private readonly categoriesService : CategoriesService ,
    private readonly frameworksService : FrameworksService
  ) {}

  /** Création d'un nouvel **Article**
   * 
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

    if (languagesList.length < 1) 
    {
      throw new BadRequestException("Il faut au moins un langage valide") 
    }
    
    /** Récupération de la liste des **Catégories** liées à l'**Article** */
    const categoriesList = await this.categoriesService.findManyCategories(categories)

    if (categoriesList.length < 1) 
    {
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
      status : isPublic ? ArticleStatus.Public : ArticleStatus.Private
    })
    return newArticle 
  }

  /** Demande de création d'un nouvel **Article** privé
   * 
   * @access *1 user*
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
      data : data.asObject() }
  }

  /** Demande de création d'un nouvel **Article** publique
   * 
   * @access *2 author*
   * @param createArticleDto  propriétés du nouvel **Article**
   * @param user              le **User** effectuant la requete
   * @returns                 le nouvel **Article**
   */
  @UseGuards(JwtAuthGuard)
  @Post("public")
  async createPublic(@Body() createArticleDto: CreateArticleDto, @GetAuthor() user : User) 
  {
    const data = await this.create(createArticleDto,user,true)
    return {
      message : "L'article a bien été créé",
      data : data.asObject() }
  }

  /** Récupération de tous les **Articles** publiques
   * 
   * @access *0 visitor*
   * @returns La liste des **Articles** publiques
   */
  @Get()
  async findAllPublic() 
  {
    
    return {
      message : "Liste de tous les articles public",
      data :(await this.articlesService.findAllPublic()).map(item => item.asObject())
    } ;
  }

  /** Récupération de tous les **Articles** d'un **User**
   * 
   * @access *1 user*
   * @param user le **User** effectuant la requete
   * @returns   La liste des **Articles** du **User**
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("user")
  @Get("user")
  async findAllMine(@GetUser() user : User) 
  {
    return {
      message : `Liste de tous les articles de ${user.pseudo}`,
      data : ( await this.articlesService.findAllMine(user.id)).map(item => item.asObject() )
    } ;
  }

  /** Récupération de tous les **Articles** soumis pour validation
   * 
   * @access *3 moderator*
   * @returns La liste des **Articles** soumis pour validation
   */
  @UseGuards(JwtAuthGuard)
  @Get("submit")
  async findAllSubmit(@GetModerator() _ : User) 
  {
    return {
      message : `Liste des articles soumis pour validation`,
      data : ( await this.articlesService.findAllSubmit()).map(item => item.asObject() )
    } ;
  }

  /** Récupération d'un **Article** 
   * 
   * @access      *1 user* ou *2 author*      => publique / privé
   * @access      *3 moderator* ou *4 admin*  => publique / privé / submit
   * @param id    de l'**Article** recherché
   * @param user  le **User** effectuant la requete
   * @returns     l'**Article** recherché
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @GetUser() user : User) 
  {
    /** Récupération de l'**Article** */
    const article = await this.articlesService.findOneById(+id)

    // Vérification de l'existance de l'Article
    if (article === null)
    {
      throw new NotFoundException("Cette article n'existe pas")
    }

    // Vérification de la propriété d'un Aticle privé
    if (
      article.status === ArticleStatus.Private && 
      article.user.id !== user.id
    )
    {
      throw new ForbiddenException("Cette article ne vous appartient pas")
    }

    // Vérification du bypass
    if (
      article.status === ArticleStatus.Submit && 
      user.access_lvl < 3
    )
    {
      throw new ForbiddenException("Vous n'avez pas acces à cette article")
    }

    return  {
      message : "Récupération d'un article",
      data : article.asObject() 
    }
  }

  /** Récupération d'un **Article** publique
   * 
   * @access *0 visitor*
   * @param id de l'**Article** recherché
   * @returns l'**Article** recherché
   */
  @Get('public/:id')
  async findOnePublic(@Param('id') id: string) 
  {
    const article = await this.articlesService.findOnePublicById(+id)

    if (article === null){
      throw new NotFoundException("Cette article n'existe pas")
    }

    return  {
      message : "Récupération d'un article",
      data : article.asObject() 
    }
  }

  /** Modication d'un **Article** 
   * 
   * @access *1 user*
   * @access *3 moderator* bypass propriété pour un **Article** soumis ou publique
   * @param id de l'**Article** à modifier
   * @param updateArticleDto nouvelles propriétés de l'**Article**
   * @param user  le **User** effectuant la requete
   * @returns l'**Article** modifié
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto, @GetUser() user : User) 
  {
    /** Déconstruction de la Dto */
    const { requirements, languages, categories, frameworks,...base} = updateArticleDto ;

    /** L'**Article** à modifier */
    const article = await this.articlesService.findOneById(+id)

    // Vérification de l'existance de l'Article
    if (article === null )
    {
      throw new NotFoundException("Cette article n'existe pas")
    }

    // Vérification de la propriété pour un Article privé
    if 
    ( 
      article.status === ArticleStatus.Private &&
      article.user.id !== user.id
    )
    {
      throw new ForbiddenException("Vous n'etes pas le propriétaire de cette article")
    }
    
    // Vérification du niveau d'accés pour les autres Articles
    if 
    ( 
      article.status !== ArticleStatus.Private &&
      article.user.id !== user.id &&
      user.access_lvl < 3
    )
    {
      throw new ForbiddenException("Vous n'avez pas accés à cette article")
    }

    /** Récupération des **Langages** liés à l'**Article** */
    let languagesList : Language[] = []

    if (languages)
    {
      languagesList = await this.languagesService.findManyLanguage(languages)
      if (languagesList.length < 1) {
        throw new BadRequestException("Il faut au moins un langage valide") 
      }
    }
    
    /** Récupération des **Catégories** liées à l'**Article** */
    let categoriesList : Category[] = []
    if (categories)
    {
      categoriesList = await this.categoriesService.findManyCategories(categories)
      if (categoriesList.length < 1) {
        throw new BadRequestException("Il faut au moins une categorie valide") 
      }
    }
    
    /** Récupération des **FrameWorks** liés à l'**Article** */
    let frameworksList : Framework[] = []
    if (frameworks){
      frameworksList = await this.frameworksService.findManyFramework(frameworks)
    }
    
    /** Récupération des prérequis */
    let requirementsList : Article[] = []
    if (requirements){
      requirementsList = (
        await this.articlesService.findManyByIds(requirements)
      )
      .filter(item => item.id !== +id);
    }

    /** Données de la mise à jour */
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

  /** Soumettre un **Article** pour validation
   * 
   * @access *1 user*
   * @param id de l'**Article** à soumettre
   * @param user le **User** effectuant la requete
   * @returns l'**Article** soumis pour validation
   */
  @UseGuards(JwtAuthGuard)
  @Patch('submit/:id')
  async submit(@Param('id') id: string, @GetUser() user : User) 
  {
    /** L'**Article** à soumettre */
    const article = await this.articlesService.findOneById(+id)

    /** Vérification de l'existance de l'Article */
    if (article === null )
    {
      throw new NotFoundException( "Cette article n'existe pas" )
    }

    /** Vérification de la propriété */
    if ( article.user.id !== user.id )
    {
      throw new ForbiddenException( "Vous n'etes pas le propriétaire de cette article" )
    }

    /** Vérification du status */
    if ( article.status === ArticleStatus.Submit )
    {
      throw new ForbiddenException( "L'article est déjà soumis pour validation" )
    }

    if ( article.status === ArticleStatus.Public )
    {
      throw new ForbiddenException( "L'article est déjà publique" )
    }
    
    return  {
      message : "Article soumis pour publication",
      data : (await this.articlesService.changeStatus(+id , ArticleStatus.Submit) )?.asObject()
    }
  
  }

  /** Validation d'un **Article**
   * 
   * @access *3 moderator*
   * @param id de l'**Article** à valider
   * @returns l'**Article** validé
   */
  @UseGuards(JwtAuthGuard)
  @Patch('validate/:id')
  async validate(@Param('id') id: string, @GetModerator() _ : User) 
  {
    /** L'**Article** à soumettre */
    const article = await this.articlesService.findOneById(+id)

    /** Vérification de l'existance de l'Article */
    if (article === null )
    {
      throw new NotFoundException( "Cette article n'existe pas" )
    }

    /** Vérification du status */
    if ( article.status === ArticleStatus.Public )
    {
      throw new ForbiddenException("L'article est déjà publique")
    }

    if ( article.status === ArticleStatus.Private )
    {
      throw new ForbiddenException("L'article n'est pas soumis pour validation")
    }
    
    return {
      message : "Article soumis pour publication",
      data : ( await this.articlesService.changeStatus(+id , ArticleStatus.Public) )?.asObject()
    }
  }


  /** Suppression d'un **Article** 
   * 
   * @access *1 user*
   * @access *3 moderator* bypass propriété pour un **Article** soumis ou publique
   * @param id de l'**Article** à supprimer
   * @param user  le **User** effectuant la requete
   * @returns l'**Article** supprimé
   */
  @Delete(':id')
  async remove(@Param('id') id: string, @GetUser() user : User) 
  {
    /** L'**Article** à modifier */
    const article = await this.articlesService.findOneById(+id)

    // Vérification de l'existance de l'Article
    if (article === null )
    {
      throw new NotFoundException("Cette article n'existe pas")
    }

    // Vérification de la propriété pour un Article privé
    if 
    ( 
      article.status === ArticleStatus.Private &&
      article.user.id !== user.id
    )
    {
      throw new ForbiddenException("Vous n'etes pas le propriétaire de cette article")
    }
    
    // Vérification du niveau d'accés pour les autres Articles
    if 
    ( 
      article.status !== ArticleStatus.Private &&
      article.user.id !== user.id &&
      user.access_lvl < 3
    )
    {
      throw new ForbiddenException("Vous n'avez pas accés à cette article")
    }

    return  {
      message : "Suppression d'un article",
      data : (await this.articlesService.remove(+id))?.asObject()
    }
  }
}
