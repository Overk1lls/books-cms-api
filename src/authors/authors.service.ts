import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './authors.entity';
import { AuthorCreationInputDto } from './dto';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private readonly repository: Repository<Author>,
  ) {}

  async create(input: AuthorCreationInputDto): Promise<Author> {
    const author = this.repository.create(input);
    return await this.repository.save(author);
  }

  async findAll(): Promise<Author[]> {
    return await this.repository.find();
  }

  async findByIdThrowable(id: string): Promise<Author> {
    const author = await this.findById(id);
    if (!author) {
      throw new NotFoundException('Author not found!');
    }
    return author;
  }

  async findById(id: string): Promise<Author | null> {
    return await this.repository.findOneBy({ id });
  }
}
