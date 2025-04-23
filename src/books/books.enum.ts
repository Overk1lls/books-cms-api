import { registerEnumType } from '@nestjs/graphql';

export enum BookSortableFields {
  title = 'title',
  author = 'author',
  publicationDate = 'publication_date',
}

registerEnumType(BookSortableFields, {
  name: 'BookSortableFields',
});
