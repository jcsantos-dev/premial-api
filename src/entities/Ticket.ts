import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Store } from '../entities/Store';
import { TicketItem } from '../entities/TicketItem';

@Entity('ticket')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('bigint', { name: 'store_id' })
  storeId: string;

  @Column({ type: 'uuid', unique: true })
  ticket_uuid: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @CreateDateColumn({ name: 'generated_at' })
  generated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  qr_scanned_at?: Date;

  @Column({
    type: 'varchar',
    default: 'pending',
  })
  status: 'pending' | 'scanned' | 'expired' | 'cancelled';

  @Column({ type: 'int', default: 0 })
  points_assigned: number;

  @OneToMany(() => TicketItem, (item) => item.ticket, { eager: true })
  items: TicketItem[];

  @ManyToOne(() => Store, (store) => store.storeTickets)
  @JoinColumn([{ name: 'store_id', referencedColumnName: 'id' }])
  store: Store;
}
