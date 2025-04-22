import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class AuthorCreationInputDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;
}
