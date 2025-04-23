import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [CoreModule, BooksModule],
  providers: [AppService],
})
export class AppModule {}
