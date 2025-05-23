import {
  ContextType,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import {
  ThrottlerGuard,
  ThrottlerModuleOptions,
  ThrottlerStorageService,
} from '@nestjs/throttler';
import { Request, Response } from 'express';
import appConfig, { AppConfig } from '../../config/app/app.config';
import { UserRole } from '../../users/users.enum';
import { GqlContext, GqRequest } from '../interfaces';

@Injectable()
export class GraphqlThrottlerGuard extends ThrottlerGuard {
  constructor(
    options: ThrottlerModuleOptions,
    storageService: ThrottlerStorageService,
    reflector: Reflector,

    @Inject(appConfig.KEY)
    private readonly config: AppConfig,
  ) {
    super(options, storageService, reflector);
  }

  protected getRequestResponse(context: ExecutionContext): GqlContext {
    const type = context.getType<ContextType | 'graphql'>();
    if (type === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      const { req, res } = ctx.getContext<GqlContext>();
      return { req, res };
    } else {
      const ctx = context.switchToHttp();
      const req = ctx.getRequest<Request>();
      const res = ctx.getResponse<Response>();
      return { req, res } as GqlContext;
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  protected async getTracker(req: GqRequest): Promise<string> {
    const { user } = req;
    return user?.userId
      ? `user-${user.userId}`
      : ((req.headers['x-forwarded-for'] as string) ??
          req.socket.remoteAddress);
  }

  protected getLimit(context: ExecutionContext): number {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext<GqlContext>();
    const { user } = req;
    if (!user) return this.config.rateLimitUnauth;
    return user.role === UserRole.admin
      ? this.config.rateLimitAdmin
      : this.config.rateLimitAuth;
  }
}
