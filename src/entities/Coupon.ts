import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CouponType } from './CouponType';
import { ProgramType } from './ProgramType';
import { RewardType } from './RewardType';
import { Store } from './Store';
import { UserLoyaltyLog } from './UserLoyaltyLog';

@Index('idx_coupon_coupon_type', ['couponTypeId'], {})
@Index('idx_coupon_program_type', ['programTypeId'], {})
@Index('idx_coupon_reward_type', ['rewardTypeId'], {})
@Index('coupon_store_id_index', ['storeId'], {})
@Index('coupon_pkey', ['uuid'], { unique: true })
@Entity('coupon', { schema: 'public' })
export class Coupon {
  @Column('uuid', { primary: true, name: 'uuid' })
  uuid: string;

  @Column('character varying', { name: 'title', length: 255 })
  title: string;

  @Column('character varying', { name: 'description', length: 255 })
  description: string;

  @Column('bigint', { name: 'reward_type_id' })
  rewardTypeId: string;

  @Column('bigint', { name: 'program_type_id' })
  programTypeId: string;

  @Column('bigint', { name: 'coupon_type_id' })
  couponTypeId: string;

  @Column('bigint', { name: 'store_id' })
  storeId: string;

  @Column('bigint', { name: 'required_quantity', nullable: true })
  requiredQuantity: string | null;

  @Column('numeric', { name: 'required_amount', precision: 8, scale: 2, nullable: true })
  requiredAmount: string | null;

  @Column('timestamp without time zone', { name: 'valid_from', nullable: true })
  validFrom: Date | null;

  @Column('timestamp without time zone', { name: 'valid_to', nullable: true })
  validTo: Date | null;

  @Column('boolean', { name: 'is_active', default: () => 'true' })
  isActive: boolean;

  @ManyToOne(() => CouponType, (couponType) => couponType.coupons)
  @JoinColumn([{ name: 'coupon_type_id', referencedColumnName: 'id' }])
  couponType: CouponType;

  @ManyToOne(() => ProgramType, (programType) => programType.coupons)
  @JoinColumn([{ name: 'program_type_id', referencedColumnName: 'id' }])
  programType: ProgramType;

  @ManyToOne(() => RewardType, (rewardType) => rewardType.coupons)
  @JoinColumn([{ name: 'reward_type_id', referencedColumnName: 'id' }])
  rewardType: RewardType;

  @ManyToOne(() => Store, (store) => store.coupons)
  @JoinColumn([{ name: 'store_id', referencedColumnName: 'id' }])
  store: Store;

  @OneToMany(() => UserLoyaltyLog, (userLoyaltyLog) => userLoyaltyLog.coupon)
  userLoyaltyLogs: UserLoyaltyLog[];
}
