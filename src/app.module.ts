import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { CoreModule } from './core/core.module';
import { GraphqlThrottlerGuard } from './core/guards';
import { DbService } from './db/db.service';
import { HealthModule } from './health/health.module';

@Module({
  imports: [CoreModule, BooksModule, AuthModule, HealthModule],
  providers: [
    DbService,
    {
      provide: APP_GUARD,
      useClass: GraphqlThrottlerGuard,
    },
  ],
})
export class AppModule {}
