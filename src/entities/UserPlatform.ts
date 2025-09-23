import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from './UserRole';
import { User } from './User';

@Index('user_platform_pkey', ['id'], { unique: true })
@Index('user_platform_role_id_index', ['roleId'], {})
@Index('user_platform_user_id_index', ['userId'], {})
@Entity('user_platform', { schema: 'public' })
export class UserPlatform {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('bigint', { name: 'user_id' })
  userId: string;

  @Column('bigint', { name: 'role_id' })
  roleId: string;

  @ManyToOne(() => UserRole, (userRole) => userRole.userPlatforms)
  @JoinColumn([{ name: 'role_id', referencedColumnName: 'id' }])
  role: UserRole;

  @ManyToOne(() => User, (user) => user.userPlatforms)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
