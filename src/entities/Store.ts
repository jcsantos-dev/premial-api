import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Coupon } from './Coupon';
import { LevelConf } from './LevelConf';
import { Program } from './Program';
import { StreakConf } from './StreakConf';
import { UserLevel } from './UserLevel';
import { UserLoyalty } from './UserLoyalty';
import { UserLoyaltyLog } from './UserLoyaltyLog';
import { UserStreak } from './UserStreak';
import { UserStore } from './UserStore';
import { StoreProduct } from './StoreProduct';
import { Ticket } from './Ticket';
import { StoreModule } from './StoreModule';

@Index('store_pkey', ['id'], { unique: true })
@Entity('store', { schema: 'public' })
export class Store {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('character varying', { name: 'name', length: 255 })
  name: string;

  @Column('character varying', { name: 'description', length: 255 })
  description: string;

  @Column('uuid', { name: 'uuid' })
  uuid: string;

  @OneToMany(() => Coupon, (coupon) => coupon.store)
  coupons: Coupon[];

  @OneToMany(() => LevelConf, (levelConf) => levelConf.store)
  levelConfs: LevelConf[];

  @OneToMany(() => Program, (program) => program.store)
  programs: Program[];

  @OneToMany(() => StoreProduct, (storeProduct) => storeProduct.store)
  storeProducts: StoreProduct[];

  @OneToMany(() => Ticket, (ticket) => ticket.store)
  storeTickets: Ticket[];

  @OneToMany(() => StreakConf, (streakConf) => streakConf.store)
  streakConfs: StreakConf[];

  @OneToMany(() => UserLevel, (userLevel) => userLevel.store)
  userLevels: UserLevel[];

  @OneToMany(() => UserLoyalty, (userLoyalty) => userLoyalty.store)
  userLoyalties: UserLoyalty[];

  @OneToMany(() => UserLoyaltyLog, (userLoyaltyLog) => userLoyaltyLog.store)
  userLoyaltyLogs: UserLoyaltyLog[];

  @OneToMany(() => UserStreak, (userStreak) => userStreak.store)
  userStreaks: UserStreak[];

  @OneToMany(() => StoreModule, (storeModule) => storeModule.store)
  storeModules: StoreModule[];

  @OneToMany(() => UserStore, (userStore: UserStore) => userStore.store)
  userStores: UserStore[];
}
