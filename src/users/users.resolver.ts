import {
  BadRequestException,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtUserDto } from '../auth/dto';
import { JwtAuthGuard } from '../auth/jwt';
import { Roles, RolesGuard } from '../auth/roles';
import { CurrentUser } from '../auth/roles/current-user.decorator';
import { GetUserInputDto, MakeAdminInputDto } from './dto';
import { User } from './users.entity';
import { UserRole } from './users.enum';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User)
  async me(@CurrentUser() currentUser: JwtUserDto): Promise<User> {
    return await this.usersService.findByIdThrowable(currentUser.userId);
  }

  @Query(() => User, { nullable: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin)
  async getUser(@Args('input') input: GetUserInputDto): Promise<User | null> {
    if (!Object.values(input).filter(Boolean).length) {
      throw new BadRequestException('Nothing to find by!');
    }

    let user: User | null = null;

    if (input.email) {
      user = await this.usersService.findByEmail(input.email);
    } else if (input.id) {
      user = await this.usersService.findById(input.id);
    }

    return user;
  }

  @Roles(UserRole.admin)
  @Mutation(() => User)
  async makeUserAdmin(
    @Args('input') dto: MakeAdminInputDto,
    @CurrentUser() currentUser: JwtUserDto,
  ): Promise<User> {
    if (currentUser.userId === dto.userId) {
      throw new ForbiddenException('You cannot promote yourself to admin!');
    }
    return await this.usersService.updateUserRole(dto.userId, UserRole.admin);
  }
}
