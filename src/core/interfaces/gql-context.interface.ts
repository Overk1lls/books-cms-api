import { Request } from 'express';
import { JwtUserDto } from '../../auth/dto';

export interface GqlContext {
  req: Request & { user?: JwtUserDto };
}
