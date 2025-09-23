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

@Index('user_store_pkey', ['id'], { unique: true })
@Index('user_store_store_id_index', ['storeId'], {})
@Index('user_store_user_id_index', ['userId'], {})
@Entity('user_store', { schema: 'public' })
export class UserStore {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('bigint', { name: 'user_id' })
  userId: string;

  @Column('bigint', { name: 'store_id' })
  storeId: string;

  @ManyToOne(() => UserRole, (userRole) => userRole.userStores)
  @JoinColumn([{ name: 'role_id', referencedColumnName: 'id' }])
  role: UserRole;

  @ManyToOne(() => User, (user) => user.userStores)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
