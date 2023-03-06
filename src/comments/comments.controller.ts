import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Bind,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ArticlesService } from 'src/articles/articles.service';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guards';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/users/entities/user.entity';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly articlesService: ArticlesService,
  ) {}
  /** Création d'un commentaire
   *
   * @param createCommentDto Reçois le Body en param via le dto
   * @return en data son id, son contenu ainsi que l'id et le titre de l'article associé
   */
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 201, description: 'Commentaire posté' })
  @Post()
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() user: User,
  ) {
    return {
      message: `Commentaire posté`,
      data: await this.commentsService.create(createCommentDto, user),
    };
  }

  /** Récupération de tous les commentaires
   *
   * @return en data son id, son contenu ainsi que l'id et le titre de l'article associé
   */
  @ApiResponse({
    status: 200,
    description: 'Voici la liste de tous les commentaires',
  })
  @Get()
  async findAll() {
    return {
      message: 'Voici la liste de tous les commentaires',
      data: await this.commentsService.findAll(),
    };
  }

  /** Récupération d'un commentaire
   *
   * @param createCommentDto Reçois le Body en param via le dto
   * @return en data son id, son contenu ainsi que l'id et le titre de l'article associé
   */
  //Récupération de l'id user via token à add
  @ApiResponse({
    status: 200,
    description: 'Voici le commentaire n°${id}',
  })
  @Get(':id')
  @Bind(Param('id', new ParseIntPipe()))
  async findOne(@Param('id') id: string) {
    const comment = await this.commentsService.findOne(+id);
    if (comment === null) throw new NotFoundException();
    return {
      message: `Voici le commentaire n°${id}`,
      data: comment,
    };
  }

  /** Récupération de tous les commentaires lié à un article
   *
   * @param createCommentDto Reçois le Body en param via le dto
   * @return en data son id, son contenu ainsi que l'id et le titre de l'article associé
   */
  @ApiResponse({
    status: 200,
    description: "Voici tout les commentaire de l'article ${id}.",
  })
  @Get('article/:id')
  @Bind(Param('id', new ParseIntPipe()))
  async find(@Param('id') id: string) {
    const isExist = await this.articlesService.findOneById(+id);
    if (!isExist) throw new NotFoundException();
    return {
      message: `Voici tout les commentaire de l'article ${id}.`,
      data: await this.commentsService.getArticleById(+id),
    };
  }

  /** Modification du contenu d'un commentaire
   *
   * @param createCommentDto Reçois le Body en param via le dto
   * @return en data son id, son contenu, l'heure et date de modification ainsi que l'id et le titre de l'article associé
   */
  @ApiResponse({
    status: 201,
    description: 'Vous avez modifié le commentaire n°${id}',
  })
  @Patch(':id')
  @Bind(Param('id', new ParseIntPipe()))
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const commentUpdated = await this.commentsService.update(
      +id,
      updateCommentDto,
    );
    if (commentUpdated === null) throw new NotFoundException();
    return {
      message: `Vous avez modifié le commentaire n°${id}`,
      data: commentUpdated,
    };
  }

  /** Suppression d'un commentaire
   *
   * @return en data son id, son contenu, heure et date de la suppression, ainsi que l'id et le titre de l'article associé
   */
  @ApiResponse({
    status: 201,
    description: 'Commentaire n°${id} supprimé',
  })
  @Bind(Param('id', new ParseIntPipe()))
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const commentDeleted = await this.commentsService.remove(+id);
    if (commentDeleted === null) throw new NotFoundException();
    return {
      message: `Commentaire n°${id} supprimé`,
      data: commentDeleted,
    };
  }
}
