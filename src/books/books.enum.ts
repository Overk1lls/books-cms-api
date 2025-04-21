import { registerEnumType } from '@nestjs/graphql';

export enum BookSortableFields {
  title = 'title',
  author = 'author',
  publicationDate = 'publicationDate',
}

registerEnumType(BookSortableFields, {
  name: 'BookSortableFields',
});
