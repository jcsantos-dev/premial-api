import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Ticket } from './Ticket';
import { StoreProduct } from './StoreProduct';

@Entity('ticket_item')
export class TicketItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('bigint', { name: 'ticket_id' })
  ticketId: string;

  @Column('bigint', { name: 'product_id' })
  productId: number;

  @ManyToOne(() => Ticket, (ticket) => ticket.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;

  @ManyToOne(() => StoreProduct, { eager: true })
  @JoinColumn({ name: 'product_id' })
  product: StoreProduct;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price_unit: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;
}
