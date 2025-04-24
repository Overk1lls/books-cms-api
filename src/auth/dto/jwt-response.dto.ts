import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class JwtResponseDto {
  @Field(() => String)
  accessToken: string;
}
