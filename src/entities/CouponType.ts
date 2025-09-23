import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Coupon } from './Coupon';

@Index('coupon_type_pkey', ['id'], { unique: true })
@Entity('coupon_type', { schema: 'public' })
export class CouponType {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('character varying', { name: 'name', length: 255 })
  name: string;

  @Column('character varying', { name: 'description', length: 255 })
  description: string;

  @OneToMany(() => Coupon, (coupon) => coupon.couponType)
  coupons: Coupon[];
}
