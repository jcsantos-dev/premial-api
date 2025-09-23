import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LevelConf } from './LevelConf';

@Index('level_type_pkey', ['id'], { unique: true })
@Entity('level_type', { schema: 'public' })
export class LevelType {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('character varying', { name: 'name', length: 50 })
  name: string;

  @Column('character varying', { name: 'description', length: 255 })
  description: string;

  @OneToMany(() => LevelConf, (levelConf) => levelConf.levelType)
  levelConfs: LevelConf[];
}
