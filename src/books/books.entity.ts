import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityAttributes, EntityOptional } from '../app.types';

@Entity({ name: 'books' })
@ObjectType()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  title: string;

  @Column()
  @Field()
  author: string;

  @Column()
  @Field()
  publicationDate: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  genre: string;
}

export type BookCreationAttrs = EntityOptional<EntityAttributes<Book>, 'genre'>;
export type BookUpdateAttrs = EntityAttributes<Book>;
