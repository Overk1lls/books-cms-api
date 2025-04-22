import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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

  @Field(() => [Book], { nullable: true })
  @OneToMany(() => Book, (b) => b.author)
  books?: Book[];
}
