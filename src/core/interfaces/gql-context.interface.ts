import { Request, Response } from 'express';
import { JwtUserDto } from '../../auth/dto';

export interface GqRequest extends Request {
  user?: JwtUserDto;
}

export interface GqlContext {
  req: GqRequest;
  res: Response;
}
