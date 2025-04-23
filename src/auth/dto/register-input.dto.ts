import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class RegisterInputDto {
  @Field(() => String, { nullable: false })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field(() => String, { nullable: false })
  @IsString()
  @IsNotEmpty()
  password: string;
}
