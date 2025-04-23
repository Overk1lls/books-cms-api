import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '../redis/redis.module';
import { Author } from './authors.entity';
import { AuthorsResolver } from './authors.resolver';
import { AuthorsService } from './authors.service';

@Module({
  imports: [RedisModule, TypeOrmModule.forFeature([Author])],
  providers: [AuthorsService, AuthorsResolver],
  exports: [AuthorsService],
})
export class AuthorsModule {}
