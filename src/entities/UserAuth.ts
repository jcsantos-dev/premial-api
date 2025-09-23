import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthType } from './AuthType';
import { User } from './User';

@Index('idx_user_auth_email', ['email'], {})
@Index('user_auth_pkey', ['id'], { unique: true })
@Index('user_auth_user_id_index', ['userId'], {})
@Entity('user_auth', { schema: 'public' })
export class UserAuth {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('bigint', { name: 'user_id' })
  userId: string;

  @Column('character varying', { name: 'auth_user_provider_id', length: 255 })
  authUserProviderId: string;

  @Column('character varying', { name: 'email', length: 255 })
  email: string;

  @Column('character varying', {
    name: 'password_hash',
    nullable: true,
    length: 255,
  })
  passwordHash: string | null;

  @Column('timestamp without time zone', { name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => AuthType, (authType) => authType.userAuths)
  @JoinColumn([{ name: 'auth_type_id', referencedColumnName: 'id' }])
  authType: AuthType;

  @ManyToOne(() => User, (user) => user.userAuths)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
