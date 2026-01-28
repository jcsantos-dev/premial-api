import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from 'src/entities/Ticket';
import { TicketItem } from 'src/entities/TicketItem';
import { UserLoyalty } from 'src/entities/UserLoyalty';
import { StoreProduct } from 'src/entities/StoreProduct';
import { UserLoyaltyLog } from 'src/entities/UserLoyaltyLog';
import { UserCustomer } from 'src/entities/UserCustomer';
import { LoyaltyActionType } from 'src/entities/LoyaltyActionType';
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
    @InjectRepository(UserLoyaltyLog)
    private userLoyaltyLogRepo: Repository<UserLoyaltyLog>,
    @InjectRepository(UserCustomer)
    private userCustomerRepo: Repository<UserCustomer>,
    @InjectRepository(LoyaltyActionType)
    private loyaltyActionTypeRepo: Repository<LoyaltyActionType>,
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
      // Primero obtener el usuario global (User) a través de UserCustomer
      const userCustomer = await this.userCustomerRepo.findOne({
        where: { id: createTicketDto.qr_scanned_by_user_id },
        relations: ['user'],
      });

      if (userCustomer && userCustomer.user) {
        const userId = userCustomer.user.id;

        let loyalty = await this.userLoyaltyRepo.findOne({
          where: {
            userCustomerId: userId, // Usamos el ID del usuario global
            storeId: createTicketDto.storeId,
          },
        });

        if (!loyalty) {
          loyalty = this.userLoyaltyRepo.create({
            userCustomerId: userId,
            storeId: createTicketDto.storeId,
            points: 0,
            visits: 0,
          });
        }

        loyalty.points = (Number(loyalty.points) || 0) + totalPoints;

        if (createTicketDto.isVisit) {
          loyalty.visits = (Number(loyalty.visits) || 0) + 1;
        }

        await this.userLoyaltyRepo.save(loyalty);

        // 5. Crear Log de Actividad (UserLoyaltyLog)
        // Buscar tipo 'compra' o 'purchase'
        let actionType = await this.loyaltyActionTypeRepo.findOne({
          where: { name: 'compra' },
        });
        if (!actionType)
          actionType = await this.loyaltyActionTypeRepo.findOne({
            where: { name: 'purchase' },
          });
        // Fallback: si no existe, usar el ID 1 o crear uno
        const actionTypeId = actionType ? actionType.id : '1';

        const log = this.userLoyaltyLogRepo.create({
          userId: userId,
          storeId: createTicketDto.storeId,
          loyaltyActionTypeId: actionTypeId,
          pointsDelta: totalPoints,
          visitsDelta: createTicketDto.isVisit ? 1 : 0,
          note: `Compra ticket #${savedTicket.id} - Total: $${createTicketDto.total_amount}`,
          createdAt: new Date(),
        });

        await this.userLoyaltyLogRepo.save(log);
      }
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

  async getMonthlySummary(storeId: string, year: number, month: number) {
    // Create date range for the specified month
    const startDate = new Date(year, month - 1, 1); // month is 0-indexed
    const endDate = new Date(year, month, 0, 23, 59, 59); // Last day of month

    // Find all tickets for the store in the specified month
    const tickets = await this.ticketRepo
      .createQueryBuilder('ticket')
      .where('ticket.storeId = :storeId', { storeId })
      .andWhere('ticket.generated_at >= :startDate', { startDate })
      .andWhere('ticket.generated_at <= :endDate', { endDate })
      .getMany();

    // Calculate totals
    const totalTickets = tickets.length;
    const totalSales = tickets.reduce(
      (sum, ticket) => sum + Number(ticket.total_amount || 0),
      0,
    );
    const commission = totalSales * 0.02; // 2% commission

    return {
      year,
      month,
      storeId,
      totalTickets,
      totalSales: Number(totalSales.toFixed(2)),
      commission: Number(commission.toFixed(2)),
      commissionRate: 0.02,
      tickets: tickets.map(t => ({
        id: t.id,
        total_amount: t.total_amount,
        generated_at: t.generated_at,
        status: t.status,
      })),
    };
  }

  remove(id: number) {
    return this.ticketRepo.delete(id);
  }
}
