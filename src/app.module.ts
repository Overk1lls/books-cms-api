import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { CoreModule } from './core/core.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [CoreModule, BooksModule, UsersModule],
  providers: [AppService],
})
export class AppModule {}
