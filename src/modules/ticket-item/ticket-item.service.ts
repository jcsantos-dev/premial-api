import { Injectable } from '@nestjs/common';
import { CreateTicketItemDto } from './dto/create-ticket-item.dto';
import { UpdateTicketItemDto } from './dto/update-ticket-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketItem } from 'src/entities/TicketItem';
import { Repository } from 'typeorm';

@Injectable()
export class TicketItemService {
  constructor(
    @InjectRepository(TicketItem)
    private repo: Repository<TicketItem>,
  ) {}

  create(createTicketItemDto: CreateTicketItemDto) {
    const entity = this.repo.create(createTicketItemDto);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ relations: ['ticket'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['ticket'] });
  }

  findByTicket(ticketId: number) {
    return this.repo.find({
      where: { ticketId: String(ticketId) },
      relations: ['ticket', 'product'],
    });
  }

  async update(id: number, updateTicketItemDto: UpdateTicketItemDto) {
    await this.repo.update(id, updateTicketItemDto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
