import 'dotenv/config';
import { DataSource } from 'typeorm';
import { PostgresConnectionCredentialsOptions } from 'typeorm/driver/postgres/PostgresConnectionCredentialsOptions';

const host = process.env.DB_HOST;
const writePort = +(process.env.DB_PORT_WRITE ?? 5432);
const readPort = +(process.env.DB_PORT_WRITE ?? 5432);
const database = process.env.DB_DATABASE;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const options: PostgresConnectionCredentialsOptions = {
  host,
  database,
  username,
  password,
};

export default new DataSource({
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
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['migrations/**/*.{ts,js}'],
  migrationsTableName: 'migrations',
});
