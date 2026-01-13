import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Store } from './Store';
import { User } from './User';
import { UserCustomer } from './UserCustomer';

@Index('user_loyalty_pkey', ['id'], { unique: true })
@Index('uq_user_loyalty', ['storeId', 'userCustomerId'], { unique: true })
@Entity('user_loyalty', { schema: 'public' })
export class UserLoyalty {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('bigint', { name: 'user_customer_id' })
  userCustomerId: string;

  @Column('bigint', { name: 'store_id', nullable: true })
  storeId: string | null;

  @Column('integer', { name: 'points', default: () => '0' })
  points: number;

  @Column('integer', { name: 'visits', default: () => '0' })
  visits: number;

  @Column('integer', { name: 'referrals', default: () => '0' })
  referrals: number;

  @Column('integer', { name: 'redeemed_points', default: () => '0' })
  redeemedPoints: number;

  @Column('timestamp without time zone', {
    name: 'created_at',
    default: () => 'now()',
  })
  createdAt: Date;

  @Column('timestamp without time zone', {
    name: 'updated_at',
    default: () => 'now()',
  })
  updatedAt: Date;

  @ManyToOne(() => Store, (store) => store.userLoyalties)
  @JoinColumn([{ name: 'store_id', referencedColumnName: 'id' }])
  store: Store;

  @ManyToOne(() => User, (user) => user.userLoyalties)
  @JoinColumn([{ name: 'user_customer_id', referencedColumnName: 'id' }])
  user: User;
}
