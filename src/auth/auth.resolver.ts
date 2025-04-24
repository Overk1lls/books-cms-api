import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import appConfig, { AppConfig } from '../config/app/app.config';
import { User } from '../users/users.entity';
import { UserRole } from '../users/users.enum';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { JwtResponseDto, LoginInputDto, RegisterInputDto } from './dto';

@Resolver()
export class AuthResolver {
  constructor(
    @Inject(appConfig.KEY) private readonly config: AppConfig,

    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Mutation(() => User)
  async register(@Args('input') dto: RegisterInputDto): Promise<User> {
    const hashedPassword = await this.authService.hashPassword(dto.password);
    return await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
      // for testing purposes only
      role:
        dto.email === this.config.initialAdminEmail
          ? UserRole.admin
          : UserRole.user,
    });
  }

  @Mutation(() => JwtResponseDto)
  async login(@Args('input') dto: LoginInputDto): Promise<JwtResponseDto> {
    const user = await this.authService.validateUser(dto.email, dto.password);
    return this.authService.login(user);
  }
}
