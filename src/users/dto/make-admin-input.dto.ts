import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class MakeAdminInputDto {
  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
