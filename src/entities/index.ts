import { AuthType } from './AuthType';
import { Coupon } from './Coupon';
import { CouponType } from './CouponType';
import { FrequencyType } from './FrequencyType';
import { LevelConf } from './LevelConf';
import { LevelType } from './LevelType';
import { LoyaltyActionType } from './LoyaltyActionType';
import { Program } from './Program';
import { ProgramType } from './ProgramType';
import { RewardType } from './RewardType';
import { Store } from './Store';
import { StreakConf } from './StreakConf';
import { StreakType } from './StreakType';
import { Ticket } from './Ticket';
import { User } from './User';
import { UserAuth } from './UserAuth';
import { UserCustomer } from './UserCustomer';
import { UserLevel } from './UserLevel';
import { UserLoyalty } from './UserLoyalty';
import { UserLoyaltyLog } from './UserLoyaltyLog';
import { UserPlatform } from './UserPlatform';
import { UserRole } from './UserRole';
import { UserStore } from './UserStore';
import { UserStreak } from './UserStreak';
import { TicketItem } from './TicketItem';
import { StoreProduct } from './StoreProduct';

export const entities = {
  AuthType,
  Coupon,
  CouponType,
  FrequencyType,
  LevelConf,
  LevelType,
  LoyaltyActionType,
  Program,
  ProgramType,
  RewardType,
  Store,
  StreakConf,
  StreakType,
  User,
  UserAuth,
  UserCustomer,
  UserLevel,
  UserLoyalty,
  UserLoyaltyLog,
  UserPlatform,
  UserRole,
  UserStore,
  UserStreak,
  Ticket,
  TicketItem,
  StoreProduct,
};

export type EntityMap = typeof entities;
