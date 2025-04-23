import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EntityAttributes } from '../app.types';
import { Book } from '../books/books.entity';

@ObjectType()
@Entity('authors')
export class Author {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  biography?: string;

  @Field(() => Int, { nullable: true })
  booksCount?: number;

  @Field(() => [Book], { nullable: true })
  @OneToMany(() => Book, (b) => b.author)
  books?: Book[];
}

export type AuthorUpdateAttrs = Partial<EntityAttributes<Author>>;
