import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Store } from './Store';
import { TicketItem } from './TicketItem';

@Entity('store_product')
export class StoreProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('bigint', { name: 'store_id' })
  storeId: string;

  @ManyToOne(() => Store, (store) => store.storeProducts)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'set_points' })
  set_points: number;

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => TicketItem, (item) => item.product)
  items: TicketItem[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
