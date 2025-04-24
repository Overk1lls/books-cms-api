import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  admin = 'admin',
  user = 'user',
}

registerEnumType(UserRole, {
  name: 'UserRole',
});
