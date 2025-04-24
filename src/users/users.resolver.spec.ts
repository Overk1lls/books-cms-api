import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtUserDto } from '../auth/dto';
import { User } from '../users/users.entity';
import { UserRole } from '../users/users.enum';
import { UsersService } from '../users/users.service';
import { UsersResolver } from './users.resolver';

describe('UsersResolver', () => {
  let module: TestingModule;
  let resolver: UsersResolver;
  let service: UsersService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findByIdThrowable: jest.fn(),
            findByEmail: jest.fn(),
            updateUserRole: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get(UsersResolver);
    service = module.get(UsersService);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('me', () => {
    it('should find me', async () => {
      const currentUser: JwtUserDto = {
        userId: '1',
        role: UserRole.admin,
      };
      const mockUser: User = {
        id: currentUser.userId,
        email: '123',
        password: '123',
        role: currentUser.role,
      };

      jest.spyOn(service, 'findByIdThrowable').mockResolvedValueOnce(mockUser);

      const result = await resolver.me(currentUser);

      expect(result).toEqual(mockUser);
    });
  });

  describe('getUser', () => {
    it('should throw if empty object', async () => {
      const invokeFn = () => resolver.getUser({});

      await expect(invokeFn).rejects.toThrow(BadRequestException);
    });

    it('should get user by email', async () => {
      const mockedUser = { email: '123' } as User;

      jest.spyOn(service, 'findByEmail').mockResolvedValueOnce(mockedUser);

      const result = await resolver.getUser({ email: mockedUser.email });

      expect(result).toEqual(mockedUser);
    });

    it('should get user by id', async () => {
      const mockedUser = { id: '123' } as User;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(mockedUser);

      const result = await resolver.getUser({ id: mockedUser.id });

      expect(result).toEqual(mockedUser);
    });
  });

  describe('makeUserAdmin', () => {
    it('should throw if self promotion', async () => {
      const invokeFn = () =>
        resolver.makeUserAdmin(
          { userId: '123' },
          { userId: '123', role: UserRole.admin },
        );

      await expect(invokeFn).rejects.toThrow(ForbiddenException);
    });

    it('should promote to admin', async () => {
      const mockedUser = { email: '123' } as User;

      jest.spyOn(service, 'updateUserRole').mockResolvedValueOnce(mockedUser);

      const result = await resolver.makeUserAdmin(
        { userId: '123' },
        { userId: '456', role: UserRole.admin },
      );

      expect(result).toEqual(mockedUser);
    });
  });
});
