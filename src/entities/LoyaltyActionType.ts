import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserLoyaltyLog } from './UserLoyaltyLog';

@Index('loyalty_action_type_pkey', ['id'], { unique: true })
@Entity('loyalty_action_type', { schema: 'public' })
export class LoyaltyActionType {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('character varying', { name: 'name', length: 50 })
  name: string;

  @Column('character varying', { name: 'description', length: 255 })
  description: string;

  @OneToMany(
    () => UserLoyaltyLog,
    (userLoyaltyLog) => userLoyaltyLog.loyaltyActionType,
  )
  userLoyaltyLogs: UserLoyaltyLog[];
}
