import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProgramType } from './ProgramType';
import { Store } from './Store';
import { UserLoyaltyLog } from './UserLoyaltyLog';

@Index('program_pkey', ['id'], { unique: true })
@Index('program_store_id_index', ['storeId'], {})
@Entity('program', { schema: 'public' })
export class Program {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('bigint', { name: 'store_id' })
  storeId: string;

  @Column('boolean', { name: 'is_active', default: () => 'false' })
  isActive: boolean;

  @ManyToOne(() => ProgramType, (programType) => programType.programs)
  @JoinColumn([{ name: 'program_type_id', referencedColumnName: 'id' }])
  programType: ProgramType;

  @ManyToOne(() => Store, (store) => store.programs)
  @JoinColumn([{ name: 'store_id', referencedColumnName: 'id' }])
  store: Store;

  @OneToMany(() => UserLoyaltyLog, (userLoyaltyLog) => userLoyaltyLog.program)
  userLoyaltyLogs: UserLoyaltyLog[];
}
