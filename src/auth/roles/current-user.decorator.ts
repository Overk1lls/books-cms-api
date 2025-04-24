import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GqlContext } from '../../core/interfaces';
import { JwtUserDto } from '../dto';

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): JwtUserDto => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext<GqlContext>().req.user!;
  },
);
