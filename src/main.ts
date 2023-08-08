import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express'; 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/public', express.static('public'));
  app.enableCors({
    origin:"*",
    credentials:true     
  })
  await app.listen(process.env.APP_PORT);
}
bootstrap();
