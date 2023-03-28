import { ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './errors/AllExceptionsFilter';
import { ResponserInterceptor } from './interceptors/responser.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  ConfigModule.forRoot();
  const port = process.env.PORT || 3000;

  app.setGlobalPrefix('api/');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Au Fil du Dev')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('dev')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponserInterceptor());

  await app.listen(port);
  console.log('Server started at http://localhost:'+ port);
}
bootstrap();
