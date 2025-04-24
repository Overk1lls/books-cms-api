import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/users.entity';
import { UserRole } from '../users/users.enum';
import { UsersService } from '../users/users.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtResponseDto } from './dto';

describe('AuthResolver', () => {
  let module: TestingModule;
  let resolver: AuthResolver;
  let usersService: UsersService;
  let authService: AuthService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
            hashPassword: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get(AuthResolver);
    usersService = module.get(UsersService);
    authService = module.get(AuthService);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('register', () => {
    it('should register', async () => {
      const mockUser: User = {
        id: '1',
        email: '123',
        password: '123',
        role: UserRole.admin,
      };

      jest.spyOn(usersService, 'create').mockResolvedValueOnce(mockUser);

      const result = await resolver.register(mockUser);

      expect(result).toEqual(mockUser);
    });
  });

  describe('login', () => {
    it('should login', async () => {
      const mockJwt: JwtResponseDto = {
        accessToken: '123',
      };

      jest.spyOn(authService, 'login').mockReturnValueOnce(mockJwt);

      const result = await resolver.login({ email: '123', password: '123' });

      expect(result).toEqual(mockJwt);
    });
  });
});
