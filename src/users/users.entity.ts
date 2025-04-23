import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityAttributes, EntityOptional } from '../app.types';
import { UserRole } from './users.enum';

@ObjectType()
@Entity('users')
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @HideField()
  @Exclude()
  @Column()
  password: string;

  @Field(() => UserRole)
  @Column('enum', { enum: UserRole, default: UserRole.user })
  role: UserRole;
}

export type UserCreationAttrs = EntityOptional<EntityAttributes<User>, 'role'>;
