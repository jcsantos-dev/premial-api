import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from 'src/entities/Ticket';
import { TicketItem } from 'src/entities/TicketItem';
import { UserLoyalty } from 'src/entities/UserLoyalty';
import { StoreProduct } from 'src/entities/StoreProduct';
import { Repository } from 'typeorm';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepo: Repository<Ticket>,
    @InjectRepository(TicketItem)
    private ticketItemRepo: Repository<TicketItem>,
    @InjectRepository(UserLoyalty)
    private userLoyaltyRepo: Repository<UserLoyalty>,
    @InjectRepository(StoreProduct)
    private productRepo: Repository<StoreProduct>,
  ) { }

  async create(createTicketDto: CreateTicketDto) {
    // 1. Calcular puntos basados en set_points de productos
    let totalPoints = 0;
    for (const item of createTicketDto.items) {
      const product = await this.productRepo.findOne({ where: { id: item.productId } });
      if (product) {
        totalPoints += (Number(product.set_points) || 0) * item.quantity;
      }
    }

    // 2. Crear ticket
    const ticket = this.ticketRepo.create({
      storeId: createTicketDto.storeId,
      total_amount: createTicketDto.total_amount,
      status: 'pending',
      points_assigned: totalPoints,
      qr_scanned_by_user_id: createTicketDto.qr_scanned_by_user_id,
    });

    const savedTicket = await this.ticketRepo.save(ticket);

    // 3. Crear items
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

    // 4. Actualizar lealtad si hay usuario
    if (createTicketDto.qr_scanned_by_user_id) {
      let loyalty = await this.userLoyaltyRepo.findOne({
        where: {
          userCustomerId: createTicketDto.qr_scanned_by_user_id,
          storeId: createTicketDto.storeId
        }
      });

      if (!loyalty) {
        loyalty = this.userLoyaltyRepo.create({
          userCustomerId: createTicketDto.qr_scanned_by_user_id,
          storeId: createTicketDto.storeId,
          points: 0,
          visits: 0
        });
      }

      loyalty.points = (Number(loyalty.points) || 0) + totalPoints;
      loyalty.visits = (Number(loyalty.visits) || 0) + 1;
      await this.userLoyaltyRepo.save(loyalty);
    }

    return this.ticketRepo.findOne({
      where: { id: savedTicket.id },
      relations: ['items', 'store'],
    });
  }

  findAll() {
    return this.ticketRepo.find({ relations: ['store', 'items'] });
  }

  findOne(id: number) {
    return this.ticketRepo.findOne({ where: { id }, relations: ['store', 'items'] });
  }

  findByStore(storeId: string) {
    return this.ticketRepo.find({
      where: { storeId: String(storeId) },
      relations: ['store', 'items'],
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
