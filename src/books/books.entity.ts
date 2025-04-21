import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { EntityAttributes, EntityOptional } from '../app.types';

@Entity({ name: 'books' })
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

  @Column()
  @Index()
  @Field()
  author: string;

  @Column({ name: 'publication_date' })
  @Index()
  @Field()
  publicationDate: Date;

  @Column({ nullable: true })
  @Field({ nullable: true })
  genre?: string;

  @Column({ name: 'search_vector', type: 'tsvector', nullable: true })
  searchVector?: string;
}

export type BookCreationAttrs = EntityOptional<EntityAttributes<Book>, 'genre'>;
export type BookUpdateAttrs = EntityAttributes<Book>;
