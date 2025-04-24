import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserCreationAttrs } from './users.entity';
import { UserRole } from './users.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async updateUserRole(userId: string, role: UserRole): Promise<User> {
    const user = await this.findByIdThrowable(userId);
    return await this.repository.save({ ...user, role });
  }

  async findByEmailThrowable(email: string): Promise<User> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email });
  }

  async findByIdThrowable(id: string): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findOneBy({ id });
  }

  async create(user: UserCreationAttrs): Promise<User> {
    const entity = this.repository.create(user);
    return this.repository.save(entity);
  }
}
