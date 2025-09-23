import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserPlatform } from './UserPlatform';
import { UserStore } from './UserStore';

@Index('user_role_pkey', ['id'], { unique: true })
@Entity('user_role', { schema: 'public' })
export class UserRole {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('character varying', { name: 'name', length: 255 })
  name: string;

  @Column('character varying', { name: 'description', length: 255 })
  description: string;

  @OneToMany(() => UserPlatform, (userPlatform) => userPlatform.role)
  userPlatforms: UserPlatform[];

  @OneToMany(() => UserStore, (userStore) => userStore.role)
  userStores: UserStore[];
}
