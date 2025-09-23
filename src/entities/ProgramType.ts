import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Coupon } from './Coupon';
import { Program } from './Program';

@Index('program_type_pkey', ['id'], { unique: true })
@Entity('program_type', { schema: 'public' })
export class ProgramType {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('character varying', { name: 'name', length: 255 })
  name: string;

  @Column('character varying', { name: 'description', length: 255 })
  description: string;

  @OneToMany(() => Coupon, (coupon) => coupon.programType)
  coupons: Coupon[];

  @OneToMany(() => Program, (program) => program.programType)
  programs: Program[];
}
