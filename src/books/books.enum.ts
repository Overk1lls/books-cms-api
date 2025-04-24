import { registerEnumType } from '@nestjs/graphql';

export enum BookSortableFields {
  title = 'b.title',
  genre = 'b.genre',
  publicationDate = 'b.publication_date',
  author = 'a.name',
}

registerEnumType(BookSortableFields, {
  name: 'BookSortableFields',
});
