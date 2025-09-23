import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LevelConf } from './LevelConf';
import { Store } from './Store';
import { User } from './User';

@Index('user_level_pkey', ['id'], { unique: true })
@Index('uq_user_level', ['levelConfId', 'storeId', 'userId'], { unique: true })
@Index('idx_user_level_user', ['userId'], {})
@Entity('user_level', { schema: 'public' })
export class UserLevel {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('bigint', { name: 'user_id', unique: true })
  userId: string;

  @Column('bigint', { name: 'store_id', nullable: true, unique: true })
  storeId: string | null;

  @Column('bigint', { name: 'level_conf_id', unique: true })
  levelConfId: string;

  @Column('integer', { name: 'current_points', default: () => '0' })
  currentPoints: number;

  @Column('timestamp without time zone', {
    name: 'achieved_at',
    default: () => 'now()',
  })
  achievedAt: Date;

  @Column('timestamp without time zone', {
    name: 'created_at',
    default: () => 'now()',
  })
  createdAt: Date;

  @Column('timestamp without time zone', {
    name: 'updated_at',
    default: () => 'now()',
  })
  updatedAt: Date;

  @ManyToOne(() => LevelConf, (levelConf) => levelConf.userLevels)
  @JoinColumn([{ name: 'level_conf_id', referencedColumnName: 'id' }])
  levelConf: LevelConf;

  @ManyToOne(() => Store, (store) => store.userLevels)
  @JoinColumn([{ name: 'store_id', referencedColumnName: 'id' }])
  store: Store;

  @ManyToOne(() => User, (user) => user.userLevels)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
