import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LevelConf } from './LevelConf';
import { StreakConf } from './StreakConf';

@Index('frequency_type_pkey', ['id'], { unique: true })
@Entity('frequency_type', { schema: 'public' })
export class FrequencyType {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('character varying', { name: 'name', length: 50 })
  name: string;

  @Column('character varying', { name: 'description', length: 255 })
  description: string;

  @OneToMany(() => LevelConf, (levelConf) => levelConf.frequencyType)
  levelConfs: LevelConf[];

  @OneToMany(() => StreakConf, (streakConf) => streakConf.frequencyType)
  streakConfs: StreakConf[];
}
