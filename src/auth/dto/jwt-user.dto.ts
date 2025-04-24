import { UserRole } from '../../users/users.enum';

export interface JwtUserDto {
  userId: string;
  role: UserRole;
}
