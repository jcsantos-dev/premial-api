import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StoreModule } from './StoreModule';

@Index('module_type_pkey', ['id'], { unique: true })
@Index('module_type_code_key', ['code'], { unique: true })
@Entity('module_type', { schema: 'public' })
export class ModuleType {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'code', length: 50, unique: true })
  code: string;

  @Column('character varying', { name: 'name', length: 100 })
  name: string;

  @Column('character varying', { name: 'label', length: 100 })
  label: string;

  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @OneToMany(() => StoreModule, (storeModule) => storeModule.moduleType)
  storeModules: StoreModule[];
}
