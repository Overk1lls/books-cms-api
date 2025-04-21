import { ObjectType, Field, ID } from '@nestjs/graphql';
import { CreationAttributes, EntityOptional } from '../app.types';

@ObjectType()
export class Book {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  author: string;

  @Field()
  publicationDate: string;

  @Field({ nullable: true })
  genre: string;
}

export type BookCreationAttrs = EntityOptional<CreationAttributes<Book>, 'genre'>;
