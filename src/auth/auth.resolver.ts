import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { JwtResponseDto, LoginInputDto, RegisterInputDto } from './dto';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Mutation(() => User)
  async register(@Args('input') dto: RegisterInputDto): Promise<User> {
    const hashedPassword = await this.authService.hashPassword(dto.password);
    return await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
    });
  }

  @Mutation(() => JwtResponseDto)
  async login(@Args('input') dto: LoginInputDto): Promise<JwtResponseDto> {
    const user = await this.authService.validateUser(dto.email, dto.password);
    return this.authService.login(user);
  }
}
