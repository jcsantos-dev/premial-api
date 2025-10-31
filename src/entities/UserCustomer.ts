import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';
import { UserLoyalty } from './UserLoyalty';

@Index('user_customer_pkey', ['id'], { unique: true })
@Entity('user_customer', { schema: 'public' })
export class UserCustomer {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  /*@Column('character varying', { name: 'phone', length: 255 })
  phone: string;*/

  @Column('date', { name: 'birthdate' })
  birthdate: string;

  @ManyToOne(() => User, (user) => user.userCustomers)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  // 👇 nuevo: relación inversa
  @OneToMany(() => UserLoyalty, (userLoyalty) => userLoyalty.userCustomer)
  userLoyalties: UserLoyalty[];
}
