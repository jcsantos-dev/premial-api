import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserAuth } from './UserAuth';

@Index('auth_type_pkey', ['id'], { unique: true })
@Entity('auth_type', { schema: 'public' })
export class AuthType {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('character varying', { name: 'name', length: 255 })
  name: string;

  @Column('character varying', { name: 'description', length: 255 })
  description: string;

  @OneToMany(() => UserAuth, (userAuth) => userAuth.authType)
  userAuths: UserAuth[];
}
