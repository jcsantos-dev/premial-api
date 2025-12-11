import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from 'src/entities/Ticket';
import { TicketItem } from 'src/entities/TicketItem';
import { Repository } from 'typeorm';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepo: Repository<Ticket>,
    @InjectRepository(TicketItem)
    private ticketItemRepo: Repository<TicketItem>,
  ) {}

  async create(createTicketDto: CreateTicketDto) {
    // Crear el ticket (el UUID se genera automáticamente en la DB)
    const ticket = this.ticketRepo.create({
      storeId: createTicketDto.storeId,
      total_amount: createTicketDto.total_amount,
      status: 'pending',
      points_assigned: 0,
    });

    const savedTicket = await this.ticketRepo.save(ticket);

    // Crear los items del ticket
    const ticketItems = createTicketDto.items.map((item) =>
      this.ticketItemRepo.create({
        ticketId: String(savedTicket.id),
        productId: item.productId,
        quantity: item.quantity,
        price_unit: item.price_unit,
        subtotal: item.subtotal,
      }),
    );

    await this.ticketItemRepo.save(ticketItems);

    // Retornar el ticket con sus items
    return this.ticketRepo.findOne({
      where: { id: savedTicket.id },
      relations: ['items', 'store'],
    });
  }

  findAll() {
    return this.ticketRepo.find({ relations: ['store'] });
  }

  findOne(id: number) {
    return this.ticketRepo.findOne({ where: { id }, relations: ['store'] });
  }

  findByStore(storeId: number) {
    return this.ticketRepo.find({
      where: { storeId: String(storeId) },
      relations: ['store'],
    });
  }

  async update(id: number, updateTicketDto: UpdateTicketDto) {
    await this.ticketRepo.update(id, updateTicketDto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.ticketRepo.delete(id);
  }
}
