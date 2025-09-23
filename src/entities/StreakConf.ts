import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FrequencyType } from './FrequencyType';
import { Store } from './Store';
import { StreakType } from './StreakType';
import { UserStreak } from './UserStreak';

@Index('streak_conf_pkey', ['id'], { unique: true })
@Index('idx_streak_conf_store_id', ['storeId'], {})
@Index('idx_streak_conf_type_id', ['streakTypeId'], {})
@Entity('streak_conf', { schema: 'public' })
export class StreakConf {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('bigint', { name: 'store_id', nullable: true })
  storeId: string | null;

  @Column('bigint', { name: 'streak_type_id' })
  streakTypeId: string;

  @Column('integer', { name: 'frequency_value' })
  frequencyValue: number;

  @Column('boolean', { name: 'is_active', default: () => 'true' })
  isActive: boolean;

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

  @ManyToOne(
    () => FrequencyType,
    (frequencyType) => frequencyType.streakConfs,
    { onDelete: 'RESTRICT' },
  )
  @JoinColumn([{ name: 'frequency_type_id', referencedColumnName: 'id' }])
  frequencyType: FrequencyType;

  @ManyToOne(() => Store, (store) => store.streakConfs, {
    onDelete: 'SET NULL',
  })
  @JoinColumn([{ name: 'store_id', referencedColumnName: 'id' }])
  store: Store;

  @ManyToOne(() => StreakType, (streakType) => streakType.streakConfs, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn([{ name: 'streak_type_id', referencedColumnName: 'id' }])
  streakType: StreakType;

  @OneToMany(() => UserStreak, (userStreak) => userStreak.streakConf)
  userStreaks: UserStreak[];
}
