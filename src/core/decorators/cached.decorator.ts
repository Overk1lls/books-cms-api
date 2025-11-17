import { ModuleRef } from '@nestjs/core';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { CacheService } from '../../cache/cache.service';

export function Cached<T>(
  classType: ClassConstructor<T>,
  ttl: number = 3600,
  key?: string | ((...args: unknown[]) => string),
): MethodDecorator {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    const originalMethod = descriptor.value as (
      ...args: unknown[]
    ) => Promise<T>;
    if (!originalMethod) {
      throw new Error('Decorator @Cached() can only be used on methods.');
    }

    descriptor.value = async function (
      this: { moduleRef?: ModuleRef },
      ...args: unknown[]
    ): Promise<T> {
      if (!this.moduleRef) {
        throw new Error(
          'Class must inject ModuleRef to use @Cached() decorator. Add "private readonly moduleRef: ModuleRef" to constructor.',
        );
      }

      const cacheService = this.moduleRef.get(CacheService, { strict: false });
      const argKey = typeof key === 'function' ? key(...args) : key;
      const cacheKey = `cache:${propertyKey.toString()}:${argKey}`;

      const cached = await cacheService.get<T>(cacheKey);
      if (cached !== null) {
        return plainToInstance(classType, cached, {
          enableImplicitConversion: true,
        });
      }

      const result = (await originalMethod.apply(this, args)) as T;
      await cacheService.set(cacheKey, result, ttl);

      return result;
    };

    return descriptor;
  };
}
