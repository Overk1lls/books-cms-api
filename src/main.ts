import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import appConfig, { AppConfig } from './config/app/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { port } = app.get<AppConfig>(appConfig.KEY);

  await app.listen(port);
}

bootstrap().catch(console.error);
