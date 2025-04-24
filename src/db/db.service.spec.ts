import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtendedConfigModule } from '../config/config.module';
import { TypeOrmFactoryService } from './db.factory';
import { DbService } from './db.service';

describe('DbService', () => {
  let module: TestingModule;
  let service: DbService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ExtendedConfigModule,
        TypeOrmModule.forRootAsync({
          useClass: TypeOrmFactoryService,
        }),
      ],
      providers: [DbService],
    }).compile();

    service = module.get(DbService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
