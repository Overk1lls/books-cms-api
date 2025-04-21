import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { join } from 'path';
import { PostgresConnectionCredentialsOptions } from 'typeorm/driver/postgres/PostgresConnectionCredentialsOptions';
import dbConfig, { DbConfig } from './db.config';

@Injectable()
export class TypeOrmFactoryService implements TypeOrmOptionsFactory {
  constructor(
    @Inject(dbConfig.KEY)
    private readonly config: DbConfig,
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const { host, writePort, readPort, database, username, password } =
      this.config;
    const options: PostgresConnectionCredentialsOptions = {
      host,
      database,
      username,
      password,
    };

    return {
      type: 'postgres',
      replication: {
        master: {
          ...options,
          port: writePort,
        },
        slaves: [
          {
            ...options,
            port: readPort,
          },
        ],
      },
      autoLoadEntities: true,
      entities: [join(process.cwd(), 'dist', '**', '*.entity{.ts,.js}')],
    };
  }
}
