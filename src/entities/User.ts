import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserAuth } from './UserAuth';
import { UserCustomer } from './UserCustomer';
import { UserLevel } from './UserLevel';
import { UserLoyalty } from './UserLoyalty';
import { UserLoyaltyLog } from './UserLoyaltyLog';
import { UserPlatform } from './UserPlatform';
import { UserStore } from './UserStore';
import { UserStreak } from './UserStreak';

@Index('user_pkey', ['id'], { unique: true })
@Entity('user', { schema: 'public' })
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('character varying', { name: 'email', length: 255 })
  email: string;

  @Column('character varying', { name: 'first_name', length: 255 })
  firstName: string;

  @Column('character varying', { name: 'last_name', length: 255 })
  lastName: string;

  @Column('timestamp without time zone', { name: 'created_at' })
  createdAt: Date;

  @Column('uuid', { name: 'uuid' })
  uuid: string;

  @OneToMany(() => UserAuth, (userAuth) => userAuth.user)
  userAuths: UserAuth[];

  @OneToMany(() => UserCustomer, (userCustomer) => userCustomer.user)
  userCustomers: UserCustomer[];

  @OneToMany(() => UserLevel, (userLevel) => userLevel.user)
  userLevels: UserLevel[];

  @OneToMany(() => UserLoyalty, (userLoyalty) => userLoyalty.user)
  userLoyalties: UserLoyalty[];

  @OneToMany(
    () => UserLoyaltyLog,
    (userLoyaltyLog) => userLoyaltyLog.referralUser,
  )
  userLoyaltyLogs: UserLoyaltyLog[];

  @OneToMany(() => UserLoyaltyLog, (userLoyaltyLog) => userLoyaltyLog.user)
  userLoyaltyLogs2: UserLoyaltyLog[];

  @OneToMany(() => UserPlatform, (userPlatform) => userPlatform.user)
  userPlatforms: UserPlatform[];

  @OneToMany(() => UserStore, (userStore) => userStore.user)
  userStores: UserStore[];

  @OneToMany(() => UserStreak, (userStreak) => userStreak.user)
  userStreaks: UserStreak[];
}
