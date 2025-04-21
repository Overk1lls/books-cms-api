import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book, BookCreationAttrs, BookUpdateAttrs } from './books.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly repository: Repository<Book>,
  ) {}

  async findAll(): Promise<Book[]> {
    return await this.repository.find();
  }

  async create(bookData: BookCreationAttrs): Promise<Book> {
    const book = this.repository.create(bookData);
    return await this.repository.save(book);
  }

  async update(id: string, bookData: BookUpdateAttrs): Promise<void> {
    await this.repository.update(id, bookData);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
