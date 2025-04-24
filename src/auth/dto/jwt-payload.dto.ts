import { UserRole } from '../../users/users.enum';

export interface JwtPayload {
  sub: string;
  role: UserRole;
}
