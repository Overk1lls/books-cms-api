import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { ExtendedConfigModule } from '../config/config.module';
import { GlobalAppConfig } from '../config/config.types';
import { User } from '../users/users.entity';
import { UserRole } from '../users/users.enum';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let module: TestingModule;
  let service: AuthService;
  let usersService: UsersService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ExtendedConfigModule,
        JwtModule.registerAsync({
          useFactory: (
            configService: ConfigService<GlobalAppConfig, true>,
          ) => ({
            secret: configService.get('app.jwtSecret', { infer: true }),
            signOptions: {
              expiresIn: '1h',
            },
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmailThrowable: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(AuthService);
    usersService = module.get(UsersService);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('validateUser', () => {
    it('should throw unauthorized (password mismatch)', async () => {
      jest
        .spyOn(usersService, 'findByEmailThrowable')
        .mockResolvedValueOnce({ password: 'qwe' } as User);

      const invokeFn = () => service.validateUser('123', '123');

      await expect(invokeFn).rejects.toThrow(UnauthorizedException);
    });

    it('should validate', async () => {
      const hash = await service.hashPassword('qwerty1');
      const user = { password: hash } as User;

      jest
        .spyOn(usersService, 'findByEmailThrowable')
        .mockResolvedValueOnce(user);

      const result = await service.validateUser('123', 'qwerty1');

      expect(result).toEqual(user);
    });
  });

  describe('login', () => {
    it('should generate jwt', (done) => {
      const { accessToken } = service.login({
        id: '1',
        role: UserRole.user,
      } as User);

      expect(accessToken).toBeDefined();

      done();
    });
  });

  describe('hashPassword', () => {
    it('should hash a string', async () => {
      const result = await service.hashPassword('qwerty1');

      expect(result).toBeDefined();
    });
  });
});
