import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommentsModule } from './comments/comments.module';
import { UsersModule } from './users/users.module';
import { LanguagesModule } from './languages/languages.module';
import { CategoriesModule } from './categories/categories.module';
import { FrameworksModule } from './frameworks/frameworks.module';
import { ArticlesModule } from './articles/articles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './articles/entities/article.entity';
import { User } from './users/entities/user.entity';
import { Language } from './languages/entities/language.entity';
import { Category } from './categories/entities/category.entity';
import { Framework } from './frameworks/entities/framework.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT!),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [
        Article,
        Comment,
        User,
        Language,
        Category,
        Framework
      ],
      synchronize: true,
    }),
    ArticlesModule,
    CommentsModule, 
    UsersModule, 
    LanguagesModule, 
    CategoriesModule, 
    FrameworksModule
  ],
  controllers: [AppController], 
  providers: [AppService],
})
export class AppModule {}
