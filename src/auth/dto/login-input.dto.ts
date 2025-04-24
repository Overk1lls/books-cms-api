import { InputType } from '@nestjs/graphql';
import { RegisterInputDto } from './register-input.dto';

@InputType()
export class LoginInputDto extends RegisterInputDto {}
