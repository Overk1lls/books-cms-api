import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { User } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { JwtPayload, JwtResponseDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmailThrowable(email);

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException();
    }

    return user;
  }

  login(user: User): JwtResponseDto {
    const payload: JwtPayload = { sub: user.id, role: user.role };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async hashPassword(pwd: string): Promise<string> {
    return await bcrypt.hash(pwd, 10);
  }
}
