import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Coupon } from './Coupon';

@Index('reward_type_pkey', ['id'], { unique: true })
@Entity('reward_type', { schema: 'public' })
export class RewardType {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('character varying', { name: 'name', length: 255 })
  name: string;

  @Column('character varying', { name: 'description', length: 255 })
  description: string;

  @OneToMany(() => Coupon, (coupon) => coupon.rewardType)
  coupons: Coupon[];
}
