import { Injectable } from '@nestjs/common';
import { Book, BookCreationAttrs } from './books.entity';

@Injectable()
export class BooksService {
  private readonly books: Book[] = [];

  findAll(): Book[] {
    return this.books;
  }

  create(book: BookCreationAttrs): Book {
    const newBook = {
      ...book,
      id: `${this.books.length + 1}`,
    } as Book;

    this.books.push(newBook);

    return newBook;
  }
}
