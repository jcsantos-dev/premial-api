import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgramTypesModule } from './modules/program-types/program-types.module';
import { RewardTypesModule } from './modules/reward-types/reward-types.module';
import { CouponTypesModule } from './modules/coupon-types/coupon-types.module';
import { LevelTypesModule } from './modules/level-types/level-types.module';
import { FrequencyTypesModule } from './modules/frequency-types/frequency-types.module';
import { LoyaltyActionTypesModule } from './modules/loyalty-action-types/loyalty-action-types.module';
import { StreakTypesModule } from './modules/streak-types/streak-types.module';
import { LevelConfModule } from './modules/level-conf/level-conf.module';
import { StreakConfModule } from './modules/streak-conf/streak-conf.module';
import { ProgramModule } from './modules/program/program.module';
import { StoreModule } from './modules/store/store.module';
import { CouponModule } from './modules/coupon/coupon.module';
import { AuthTypesModule } from './modules/auth-types/auth-types.module';
import { UserAuthModule } from './modules/user-auth/user-auth.module';
import { UserModule } from './modules/user/user.module';
import { UserCustomerModule } from './modules/user-customer/user-customer.module';
import { UserPlatformModule } from './modules/user-platform/user-platform.module';
import { UserStoreModule } from './modules/user-store/user-store.module';
import { UserLevelModule } from './modules/user-level/user-level.module';
import { UserLoyaltyModule } from './modules/user-loyalty/user-loyalty.module';
import { UserLoyaltyLogModule } from './modules/user-loyalty-log/user-loyalty-log.module';
import { UserRolesModule } from './modules/user-roles/user-roles.module';
import { UserStreakModule } from './modules/user-streak/user-streak.module';
import { AuthModule } from './modules/auth/auth.module';
import databaseConfig from './db/config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: `src/environments/.env.${process.env.NODE_ENV || 'development'}`,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.user'),
        password: config.get<string>('database.pass'),
        database: config.get<string>('database.name'),
        entities: [
          __dirname + '/entities/*.ts', // ProgramType.ts, Coupon.ts, Program.ts
        ],
        autoLoadEntities: true,
        //synchronize: config.get<string>('NODE_ENV') === 'development',
        //logging: config.get<string>('NODE_ENV') !== 'production',
      }),
    }),
    ProgramTypesModule,
    RewardTypesModule,
    CouponTypesModule,
    LevelTypesModule,
    FrequencyTypesModule,
    LoyaltyActionTypesModule,
    StreakTypesModule,
    LevelConfModule,
    StreakConfModule,
    ProgramModule,
    StoreModule,
    CouponModule,
    AuthTypesModule,
    UserAuthModule,
    UserModule,
    UserCustomerModule,
    UserPlatformModule,
    UserStoreModule,
    UserLevelModule,
    UserLoyaltyModule,
    UserLoyaltyLogModule,
    UserRolesModule,
    UserStreakModule,
    AuthModule,

    /*TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        //synchronize: config.get<string>('NODE_ENV') === 'development', // sincroniza solo en dev
        //logging: config.get<string>('NODE_ENV') !== 'production', // logs excepto en prod
      }),
    }),*/
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
