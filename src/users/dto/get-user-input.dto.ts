import { Field, ID, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsUUID } from 'class-validator';

@InputType()
export class GetUserInputDto {
  @Field(() => ID, { nullable: true })
  @IsUUID()
  @IsOptional()
  id?: string;

  @Field(() => String, { nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;
}
