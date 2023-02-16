import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, NotFoundException, } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  async create(@Body() createArticleDto: CreateArticleDto) {
    const {title, content, requirements} = createArticleDto ;
    const userId = 1 ; 
    const isExist = await this.articlesService.findOneByName(createArticleDto.title)
    if (isExist)
    {
      throw new ConflictException("Ce titre est déjà pris")
    }
    return await this.articlesService.create(userId, title, content, requirements) ;
  }

  @Get()
  async findAll() {
    return await this.articlesService.findAll() ;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(+id) ;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(+id, updateArticleDto) ;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articlesService.remove(+id) ;
  }
}
