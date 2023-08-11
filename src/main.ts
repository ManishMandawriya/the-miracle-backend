import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express'; 
import { APP_PORT } from './config/config.config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/public', express.static('public'));
  app.enableCors({
    origin:"*",
    credentials:true     
  })
  // await app.listen(process.env.APP_PORT);
  await app.listen(APP_PORT);
}
bootstrap();
