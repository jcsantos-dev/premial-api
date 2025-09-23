import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Store } from './Store';
import { StreakConf } from './StreakConf';
import { User } from './User';

@Index('user_streak_pkey', ['id'], { unique: true })
@Index('uq_user_streak', ['storeId', 'streakConfId', 'userId'], {
  unique: true,
})
@Index('idx_user_streak_user', ['userId'], {})
@Entity('user_streak', { schema: 'public' })
export class UserStreak {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('bigint', { name: 'user_id', unique: true })
  userId: string;

  @Column('bigint', { name: 'store_id', nullable: true, unique: true })
  storeId: string | null;

  @Column('bigint', { name: 'streak_conf_id', unique: true })
  streakConfId: string;

  @Column('integer', { name: 'current_streak', default: () => '0' })
  currentStreak: number;

  @Column('integer', { name: 'longest_streak', default: () => '0' })
  longestStreak: number;

  @Column('date', { name: 'last_check_date' })
  lastCheckDate: string;

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

  @ManyToOne(() => Store, (store) => store.userStreaks)
  @JoinColumn([{ name: 'store_id', referencedColumnName: 'id' }])
  store: Store;

  @ManyToOne(() => StreakConf, (streakConf) => streakConf.userStreaks)
  @JoinColumn([{ name: 'streak_conf_id', referencedColumnName: 'id' }])
  streakConf: StreakConf;

  @ManyToOne(() => User, (user) => user.userStreaks)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
