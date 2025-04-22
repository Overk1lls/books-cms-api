import { registerEnumType } from '@nestjs/graphql';

export enum BookSortableFields {
  title = 'title',
  genre = 'genre',
  publicationDate = 'publication_date',
}

registerEnumType(BookSortableFields, {
  name: 'BookSortableFields',
});
