import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { QueryFailedError } from 'typeorm';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { ExtendedConfigModule } from '../config/config.module';
import { randomString } from '../core/core.utils';
import { TypeOrmFactoryService } from '../db/db.factory';
import { User } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { UserRole } from './users.enum';
import { UsersModule } from './users.module';

describe('UsersService', () => {
  let module: TestingModule;
  let service: UsersService;
  let authService: AuthService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ExtendedConfigModule,
        TypeOrmModule.forRootAsync({
          useClass: TypeOrmFactoryService,
        }),
        UsersModule,
        AuthModule,
      ],
    }).compile();

    service = module.get(UsersService);
    authService = module.get(AuthService);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('updateUserRole', () => {
    it('should throw query failed (bad UUID)', async () => {
      const invokeFn = () => service.updateUserRole('123', UserRole.admin);

      await expect(invokeFn).rejects.toThrow(QueryFailedError);
    });

    it('should throw not found', async () => {
      const invokeFn = () =>
        service.updateUserRole(randomUUID(), UserRole.admin);

      await expect(invokeFn).rejects.toThrow(NotFoundException);
    });

    it('should update', async () => {
      const pwd = await authService.hashPassword('qwerty1');
      const created = await service.create({
        email: `${randomString()}@gmail.com`,
        password: pwd,
      });

      const result = await service.updateUserRole(created.id, UserRole.admin);

      expect(result).toEqual<User>({
        ...created,
        role: UserRole.admin,
      });
    });
  });

  describe('findByEmailThrowable', () => {
    it('should throw not found', async () => {
      const invokeFn = () => service.findByEmailThrowable('123');

      await expect(invokeFn).rejects.toThrow(NotFoundException);
    });

    it('should find', async () => {
      const pwd = await authService.hashPassword('qwerty1');
      const created = await service.create({
        email: `${randomString()}@gmail.com`,
        password: pwd,
      });

      const result = await service.findByEmailThrowable(created.email);

      expect(result).toEqual<User>(created);
    });
  });

  describe('findByIdThrowable', () => {
    it('should throw query failed (not UUID)', async () => {
      const invokeFn = () => service.findByIdThrowable('123');

      await expect(invokeFn).rejects.toThrow(QueryFailedError);
    });

    it('should throw not found', async () => {
      const invokeFn = () => service.findByIdThrowable(randomUUID());

      await expect(invokeFn).rejects.toThrow(NotFoundException);
    });

    it('should find', async () => {
      const pwd = await authService.hashPassword('qwerty1');
      const created = await service.create({
        email: `${randomString()}@gmail.com`,
        password: pwd,
      });

      const result = await service.findByIdThrowable(created.id);

      expect(result).toEqual<User>(created);
    });
  });
});
