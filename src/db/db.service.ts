import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DbService implements OnApplicationShutdown {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async onApplicationShutdown(): Promise<void> {
    await this.dataSource.destroy();
  }
}
