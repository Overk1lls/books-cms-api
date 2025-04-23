import { ObjectType } from '@nestjs/graphql';
import { PaginatedResponse } from '../../core/core.utils';
import { Author } from '../authors.entity';

@ObjectType()
export class PaginatedAuthorDto extends PaginatedResponse<Author>(Author) {}
