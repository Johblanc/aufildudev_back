import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommentsModule } from './comments/comments.module';
import { UsersModule } from './users/users.module';
import { LanguagesModule } from './languages/languages.module';
import { CategoriesModule } from './categories/categories.module';
import { FrameworksModule } from './frameworks/frameworks.module';

@Module({
  imports: [CommentsModule, UsersModule, LanguagesModule, CategoriesModule, FrameworksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
