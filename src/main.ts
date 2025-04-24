import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { xss } from 'express-xss-sanitizer';
import helmet from 'helmet';
import { AppModule } from './app.module';
import appConfig, { AppConfig } from './config/app/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(xss());
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          imgSrc: [
            `'self'`,
            'data:',
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
          manifestSrc: [
            `'self'`,
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
        },
      },
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.enableCors();
  app.enableShutdownHooks();

  const { port } = app.get<AppConfig>(appConfig.KEY);

  await app.listen(port);
}

bootstrap().catch(console.error);
