import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import{join} from "path"
import * as bodyParser from 'body-parser';
import * as express from "express"
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true
    })
  )
   app.enableCors({
    origin: 'http://localhost:3000', // your frontend URL
    credentials: true, // if you send cookies
  });

  const config = new DocumentBuilder()
    .setTitle('HRMS API')
    .setDescription('Full HRMS backend APIs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
     app.use(bodyParser.json());

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
   app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();


