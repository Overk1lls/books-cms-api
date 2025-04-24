import { registerEnumType } from '@nestjs/graphql';

export enum AuthorSortableFields {
  name = 'a.name',
}

registerEnumType(AuthorSortableFields, {
  name: 'AuthorSortableFields',
});
