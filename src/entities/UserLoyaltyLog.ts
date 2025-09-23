import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Coupon } from './Coupon';
import { LoyaltyActionType } from './LoyaltyActionType';
import { Program } from './Program';
import { User } from './User';
import { Store } from './Store';

@Index('user_loyalty_log_pkey', ['id'], { unique: true })
@Index('idx_user_loyalty_log_action', ['loyaltyActionTypeId'], {})
@Index('idx_user_loyalty_log_store', ['storeId'], {})
@Index('idx_user_loyalty_log_user', ['userId'], {})
@Entity('user_loyalty_log', { schema: 'public' })
export class UserLoyaltyLog {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('bigint', { name: 'user_id' })
  userId: string;

  @Column('bigint', { name: 'store_id', nullable: true })
  storeId: string | null;

  @Column('bigint', { name: 'loyalty_action_type_id' })
  loyaltyActionTypeId: string;

  @Column('integer', {
    name: 'points_delta',
    nullable: true,
    default: () => '0',
  })
  pointsDelta: number | null;

  @Column('integer', {
    name: 'visits_delta',
    nullable: true,
    default: () => '0',
  })
  visitsDelta: number | null;

  @Column('text', { name: 'note', nullable: true })
  note: string | null;

  @Column('timestamp without time zone', {
    name: 'created_at',
    default: () => 'now()',
  })
  createdAt: Date;

  @ManyToOne(() => Coupon, (coupon) => coupon.userLoyaltyLogs)
  @JoinColumn([{ name: 'coupon_id', referencedColumnName: 'uuid' }])
  coupon: Coupon;

  @ManyToOne(
    () => LoyaltyActionType,
    (loyaltyActionType) => loyaltyActionType.userLoyaltyLogs,
  )
  @JoinColumn([{ name: 'loyalty_action_type_id', referencedColumnName: 'id' }])
  loyaltyActionType: LoyaltyActionType;

  @ManyToOne(() => Program, (program) => program.userLoyaltyLogs)
  @JoinColumn([{ name: 'program_id', referencedColumnName: 'id' }])
  program: Program;

  @ManyToOne(() => User, (user) => user.userLoyaltyLogs)
  @JoinColumn([{ name: 'referral_user_id', referencedColumnName: 'id' }])
  referralUser: User;

  @ManyToOne(() => Store, (store) => store.userLoyaltyLogs)
  @JoinColumn([{ name: 'store_id', referencedColumnName: 'id' }])
  store: Store;

  @ManyToOne(() => User, (user) => user.userLoyaltyLogs2)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
