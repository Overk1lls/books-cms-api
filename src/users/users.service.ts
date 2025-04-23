import { Injectable } from '@nestjs/common';
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

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email });
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findOneBy({ id });
  }

  async create(user: UserCreationAttrs): Promise<User> {
    const entity = this.repository.create(user);
    return this.repository.save(entity);
  }

  async updateUserRole(userId: string, role: UserRole): Promise<User> {
    const user = await this.repository.findOneByOrFail({ id: userId });
    return await this.repository.save({ ...user, role });
  }
}
