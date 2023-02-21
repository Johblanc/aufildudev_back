import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { LanguagesService } from 'src/languages/languages.service';
import { CategoriesService } from 'src/categories/categories.service';
import { FrameworksService } from 'src/frameworks/frameworks.service';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService, LanguagesService, CategoriesService, FrameworksService]
})
export class ArticlesModule {}
