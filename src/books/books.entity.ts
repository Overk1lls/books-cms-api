import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityAttributes, EntityOptional } from '../app.types';
import { Author } from '../authors/authors.entity';

@Entity('books')
@Index('idx_books_search_vector', { synchronize: false })
@ObjectType()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Index()
  @Field()
  title: string;

  @Column({ name: 'publication_date' })
  @Index()
  @Field()
  publicationDate: Date;

  @Column({ nullable: true })
  @Field({ nullable: true })
  genre?: string;

  @Column('tsvector', { name: 'search_vector', nullable: true })
  searchVector?: string;

  @Field(() => Author)
  @ManyToOne(() => Author, (a) => a.books, { eager: true })
  @JoinColumn({ name: 'author_id' })
  author: Author;
}

export type BookCreationAttrs = EntityOptional<EntityAttributes<Book>, 'genre'>;
export type BookUpdateAttrs = Partial<EntityAttributes<Book>>;
