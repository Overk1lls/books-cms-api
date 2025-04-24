import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import appConfig, { AppConfig } from './config/app/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const { port } = app.get<AppConfig>(appConfig.KEY);

  await app.listen(port);
}

bootstrap().catch(console.error);
