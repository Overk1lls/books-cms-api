import { ObjectType } from '@nestjs/graphql';
import { PaginatedResponse } from '../../core/core.utils';
import { Book } from '../books.entity';

@ObjectType()
export class PaginatedBookDto extends PaginatedResponse<Book>(Book) {}
