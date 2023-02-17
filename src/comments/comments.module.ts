import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { ArticlesService } from 'src/articles/articles.service';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, ArticlesService],
})
export class CommentsModule {}
