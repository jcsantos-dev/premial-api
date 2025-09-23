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
import { LevelType } from './LevelType';
import { Store } from './Store';
import { UserLevel } from './UserLevel';

@Index('level_conf_pkey', ['id'], { unique: true })
@Index('idx_level_conf_level_type_id', ['levelTypeId'], {})
@Index('uq_levelconf_store_levelname', ['levelTypeId', 'name', 'storeId'], {
  unique: true,
})
@Index('idx_level_conf_store_id', ['storeId'], {})
@Entity('level_conf', { schema: 'public' })
export class LevelConf {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('bigint', { name: 'level_type_id', unique: true })
  levelTypeId: string;

  @Column('bigint', { name: 'store_id', nullable: true, unique: true })
  storeId: string | null;

  @Column('character varying', { name: 'name', unique: true, length: 50 })
  name: string;

  @Column('character varying', { name: 'description', length: 255 })
  description: string;

  @Column('integer', { name: 'min_points' })
  minPoints: number;

  @Column('integer', { name: 'max_points' })
  maxPoints: number;

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

  @ManyToOne(() => FrequencyType, (frequencyType) => frequencyType.levelConfs, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn([{ name: 'frequency_type_id', referencedColumnName: 'id' }])
  frequencyType: FrequencyType;

  @ManyToOne(() => LevelType, (levelType) => levelType.levelConfs, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn([{ name: 'level_type_id', referencedColumnName: 'id' }])
  levelType: LevelType;

  @ManyToOne(() => Store, (store) => store.levelConfs, { onDelete: 'SET NULL' })
  @JoinColumn([{ name: 'store_id', referencedColumnName: 'id' }])
  store: Store;

  @OneToMany(() => UserLevel, (userLevel) => userLevel.levelConf)
  userLevels: UserLevel[];
}
