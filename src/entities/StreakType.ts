import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StreakConf } from './StreakConf';

@Index('streak_type_pkey', ['id'], { unique: true })
@Entity('streak_type', { schema: 'public' })
export class StreakType {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('character varying', { name: 'name', length: 50 })
  name: string;

  @Column('character varying', { name: 'description', length: 255 })
  description: string;

  @OneToMany(() => StreakConf, (streakConf) => streakConf.streakType)
  streakConfs: StreakConf[];
}
