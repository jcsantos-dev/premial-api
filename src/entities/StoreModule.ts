import {
  Column,
  Entity,
  Index,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Store } from './Store';
import { ModuleType } from './ModuleType';

@Index('store_module_pkey', ['id'], { unique: true })
@Index(
  'store_module_store_id_module_type_id_key',
  ['storeId', 'moduleTypeId'],
  {
    unique: true,
  },
)
@Entity('store_module', { schema: 'public' })
export class StoreModule {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('bigint', { name: 'store_id' })
  storeId: string;

  @Column('integer', { name: 'module_type_id' })
  moduleTypeId: number;

  @Column('boolean', { name: 'is_enabled', default: true })
  isEnabled: boolean;

  @ManyToOne(() => Store, (store) => store.storeModules)
  @JoinColumn([{ name: 'store_id', referencedColumnName: 'id' }])
  store: Store;

  @ManyToOne(() => ModuleType, (moduleType) => moduleType.storeModules)
  @JoinColumn([{ name: 'module_type_id', referencedColumnName: 'id' }])
  moduleType: ModuleType;
}
