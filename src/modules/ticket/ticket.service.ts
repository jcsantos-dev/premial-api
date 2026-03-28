/* eslint-disable prettier/prettier */
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
import { Coupon } from 'src/entities/Coupon';
import { RewardType } from 'src/entities/RewardType';
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
    @InjectRepository(Coupon)
    private couponRepo: Repository<Coupon>,
    @InjectRepository(RewardType)
    private rewardTypeRepo: Repository<RewardType>,
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

    // 1.5. Manejo de fecha personalizada (combinar fecha provista con hora actual para evitar desfase UTC)
    let ticketDate: Date;
    if (createTicketDto.generatedAt) {
      const now = new Date();
      // 'YYYY-MM-DD' + 'T' + 'HH:mm:ss'
      const timeStr = now.toISOString().split('T')[1];
      ticketDate = new Date(`${createTicketDto.generatedAt}T${timeStr}`);
      // Si la fecha resultante es inválida (por formato), fallback a now
      if (isNaN(ticketDate.getTime())) {
        ticketDate = new Date();
      }
    } else {
      ticketDate = new Date();
    }

    // 2. Calcular total base desde los items para evitar confiar ciegamente en el DTO
    const baseSubtotal = createTicketDto.items.reduce((sum, item) => sum + Number(item.subtotal), 0);
    
    // Crear ticket con el total base original (se descontará después)
    const ticket = this.ticketRepo.create({
      storeId: createTicketDto.storeId,
      total_amount: baseSubtotal,
      status: 'pending',
      points_assigned: totalPoints,
      qr_scanned_by_user_id: createTicketDto.qr_scanned_by_user_id,
      generated_at: ticketDate,
    });

    // 2.5. Aplicar Cupones y Procesar Lealtad (UNIFICADO)
    let discountAmount = 0;
    const redeemedCoupons: Coupon[] = [];
    const userId = createTicketDto.qr_scanned_by_user_id;

    if (userId) {
      const userCustomer = await this.userCustomerRepo.findOne({
        where: { id: userId },
        relations: ['user'],
      });

      if (userCustomer && userCustomer.user) {
        const globalUserId = userCustomer.user.id;
        let loyalty = await this.userLoyaltyRepo.findOne({
          where: { userCustomerId: globalUserId, storeId: createTicketDto.storeId }
        });

        if (!loyalty) {
          loyalty = this.userLoyaltyRepo.create({
            userCustomerId: globalUserId,
            storeId: createTicketDto.storeId,
            points: 0,
            visits: 0,
          });
        }

        // Procesar cupones
        if (createTicketDto.appliedCoupons?.length) {
          console.log(`[DEBUG] Processing ${createTicketDto.appliedCoupons.length} coupons for User ${globalUserId}`);
          for (const couponData of createTicketDto.appliedCoupons) {
            const coupon = await this.couponRepo.findOne({
              where: { uuid: couponData.uuid, storeId: createTicketDto.storeId },
              relations: ['rewardType']
            });

            if (!coupon) {
              console.log(`[DEBUG] Coupon not found or store mismatch: ${couponData.uuid}`);
              continue;
            }
            if (!coupon.isActive) {
              console.log(`[DEBUG] Coupon is inactive: ${coupon.title}`);
              continue;
            }

            // Validar requisitos por Tipo de Programa
            const reqVisits = Number(coupon.requiredQuantity) || 0;
            const reqAmount = Number(coupon.requiredAmount) || 0;
            const reqQuantity = Number(coupon.requiredQuantity) || 0;
            let isEligible = true;

            if (coupon.programTypeId === '1') { // Visitas
              isEligible = loyalty.visits >= reqVisits;
            } else if (coupon.programTypeId === '2') { // Puntos
              isEligible = loyalty.points >= reqAmount;
            } else if (coupon.programTypeId === '3') { // Recomendación
              isEligible = loyalty.referrals >= (reqQuantity || 1);
            } else { // Ambos o Genérico
              isEligible = (loyalty.visits >= reqVisits && loyalty.points >= reqAmount);
            }

            if (!isEligible) {
              console.log(`[DEBUG] Not eligible for ${coupon.title}. Required: V:${reqVisits}/P:${reqAmount}. Has: V:${loyalty.visits}/P:${loyalty.points}`);
              continue;
            }

            // Calcular descuento
            let couponDiscount = 0;
            const subtotal = createTicketDto.items.reduce((sum, item) => sum + Number(item.subtotal), 0);
            let baseAmount = subtotal;
            if (coupon.productId) {
              const item = createTicketDto.items.find(it => String(it.productId) === String(coupon.productId));
              baseAmount = item ? Number(item.subtotal) : 0;
            }

            const cTitle = (coupon.title || '').toLowerCase();
            const cDesc = (coupon.description || '').toLowerCase();
            const rVal = Number(coupon.rewardValue) || 0;

            if (cTitle.includes('%') || cDesc.includes('%') || String(coupon.rewardTypeId) === '2') {
              const percent = rVal > 0 ? rVal : (reqAmount > 0 ? reqAmount : 0);
              couponDiscount = (baseAmount * percent) / 100;
            } else if (String(coupon.rewardTypeId) === '3') {
              // Regalo / Gratis: cubre el precio unitario del item si hay productId
              if (coupon.productId) {
                const item = createTicketDto.items.find(it => String(it.productId) === String(coupon.productId));
                couponDiscount = item ? Number(item.price_unit) : 0;
              } else {
                couponDiscount = rVal;
              }
            } else {
              couponDiscount = rVal > 0 ? Math.min(rVal, baseAmount) : Math.min(reqAmount, baseAmount);
            }

            console.log(`[DEBUG] Applied coupon ${coupon.title}. Discount: ${couponDiscount}`);
            // 🔹 LÓGICA DE DEDUCCIÓN ESTRICTA POR TIPO DE PROGRAMA
            // 1=Visitas, 2=Puntos, 3=Recomendación
            const pType = String(coupon.programTypeId);
            const valQuantity = Number(coupon.requiredQuantity) || 0;
            const valAmount = Number(coupon.requiredAmount) || 0;
            const deductionValue = valQuantity > 0 ? valQuantity : valAmount;

            if (pType === '2') {
              const before = Number(loyalty.points) || 0;
              loyalty.points = Math.max(0, before - deductionValue);
            } 
            else if (pType === '1') {
              if (couponData.shouldResetVisits !== false) {
                const before = Number(loyalty.visits) || 0;
                loyalty.visits = Math.max(0, before - deductionValue);
              }
            } 
            else if (pType === '3') {
              const before = Number(loyalty.referrals) || 0;
              const cost = valQuantity || 1;
              console.log(`[REFERRAL] Deducting referrals. User: ${userId}, Before: ${before}, Cost: ${cost}`);
              loyalty.referrals = Math.max(0, before - cost);
            }

            discountAmount += couponDiscount;
            redeemedCoupons.push(coupon);
          }
        }

        // Sumar beneficios de esta compra SOLO si NO hubo canje (Regla de negocio solicitada)
        if (redeemedCoupons.length === 0) {
          const beforeP = Number(loyalty.points) || 0;
          const beforeV = Number(loyalty.visits) || 0;
          
          loyalty.points = beforeP + totalPoints;
          if (createTicketDto.isVisit) loyalty.visits = beforeV + 1;
          
          console.log(`[EARN] Beneficios compra: +${totalPoints} pts, +${createTicketDto.isVisit ? 1 : 0} vis. (Total: P:${loyalty.points}, V:${loyalty.visits})`);
        } else {
          console.log(`[SKIP] No se suman puntos/visitas de la compra porque se canjeó un cupón.`);
        }

        await this.userLoyaltyRepo.save(loyalty);
        ticket.total_amount = Math.max(0, Number(ticket.total_amount) - discountAmount);
      }
    }

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

    // 4. Crear Logs (SIEMPRE usando el savedTicket.id real)
    if (userId) {
      const userCustomer = await this.userCustomerRepo.findOne({ where: { id: userId }, relations: ['user'] });
      const globalUserId = userCustomer?.user?.id;
      
      if (globalUserId) {
        // 4.1 Obtener tipos de acción necesarios
        const actionTypes = await this.loyaltyActionTypeRepo.find();
        const getActionId = (code: string) => actionTypes.find(t => t.code === code)?.id || '1';

        console.log(`[DEBUG] Creating logs. Redeemed coupons: ${redeemedCoupons.length}`);
        
        // Log de COMPRA (Siempre se registra si hay ticket)
        await this.userLoyaltyLogRepo.save(this.userLoyaltyLogRepo.create({
          userId: globalUserId,
          storeId: createTicketDto.storeId,
          loyaltyActionTypeId: getActionId('PURCHASE'),
          pointsDelta: 0,
          visitsDelta: 0,
          ticket_id: String(savedTicket.id),
          createdAt: ticketDate,
          note: `Compra ticket #${savedTicket.id} - Total: $${savedTicket.total_amount}`,
        }));

        // Log de PUNTOS (Solo si ganó puntos)
        if (redeemedCoupons.length === 0 && totalPoints > 0) {
          await this.userLoyaltyLogRepo.save(this.userLoyaltyLogRepo.create({
            userId: globalUserId,
            storeId: createTicketDto.storeId,
            loyaltyActionTypeId: getActionId('EARN_POINTS'),
            pointsDelta: totalPoints,
            visitsDelta: 0,
            ticket_id: String(savedTicket.id),
            createdAt: ticketDate,
            note: `Puntos ganados por ticket #${savedTicket.id}`,
          }));
        }

        // Log de VISITA (Solo si se marcó como visita y no hubo canje que resetee)
        if (redeemedCoupons.length === 0 && createTicketDto.isVisit) {
          await this.userLoyaltyLogRepo.save(this.userLoyaltyLogRepo.create({
            userId: globalUserId,
            storeId: createTicketDto.storeId,
            loyaltyActionTypeId: getActionId('ADD_VISIT'),
            pointsDelta: 0,
            visitsDelta: 1,
            ticket_id: String(savedTicket.id),
            createdAt: ticketDate,
            note: `Visita registrada por ticket #${savedTicket.id}`,
          }));
        }

        // Logs de CUPONES (Si hubo canjes)
        if (redeemedCoupons.length > 0) {
          for (const coupon of redeemedCoupons) {
            // Determinar deltas reales según el tipo de programa y valor unificado
            const pType = String(coupon.programTypeId);
            const valQuantity = Number(coupon.requiredQuantity) || 0;
            const valAmount = Number(coupon.requiredAmount) || 0;
            const finalValue = valQuantity > 0 ? valQuantity : valAmount;

            const isPoints = pType === '2';
            const isVisits = pType === '1';
            
            await this.userLoyaltyLogRepo.save(this.userLoyaltyLogRepo.create({
              userId: globalUserId,
              storeId: createTicketDto.storeId,
              loyaltyActionTypeId: getActionId('REDEEM_COUPON'),
              pointsDelta: isPoints ? -finalValue : (pType !== '1' && valAmount > 0 ? -valAmount : 0),
              visitsDelta: isVisits ? -finalValue : (pType !== '2' && valQuantity > 0 ? -valQuantity : 0),
              ticket_id: String(savedTicket.id),
              createdAt: ticketDate,
              note: `Canje de cupón: ${coupon.title} en ticket #${savedTicket.id}`,
              coupon_id: coupon.uuid,
            }));
          }
        }
      }
    }

    return this.ticketRepo.findOne({
      where: { id: savedTicket.id },
      relations: ['items', 'store'],
    });
  }

  findAll() {
    return this.ticketRepo.find({
      relations: ['store', 'items', 'userLoyaltyLogs', 'userLoyaltyLogs.coupon']
    });
  }

  async findOne(id: number) {
    const ticket = await this.ticketRepo.findOne({
      where: { id },
      relations: ['store', 'items', 'userLoyaltyLogs', 'userLoyaltyLogs.coupon']
    });
    console.log(`[DEBUG] findOne(${id}): Found logs:`, ticket?.userLoyaltyLogs?.length || 0);
    return ticket;
  }

  findByStore(storeId: string) {
    return this.ticketRepo.find({
      where: { storeId: String(storeId) },
      relations: ['store', 'items', 'userLoyaltyLogs', 'userLoyaltyLogs.coupon', 'userLoyaltyLogs.coupon.rewardType'],
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

  async remove(id: number) {
    const ticket = await this.ticketRepo.findOne({
      where: { id },
      relations: ['store']
    });
    if (!ticket) return;

    // 1. Revertir lealtad si hay usuario
    if (ticket.qr_scanned_by_user_id) {
      const userCustomer = await this.userCustomerRepo.findOne({
        where: { id: ticket.qr_scanned_by_user_id },
        relations: ['user']
      });

      if (userCustomer && userCustomer.user) {
        const userId = userCustomer.user.id;
        const loyalty = await this.userLoyaltyRepo.findOne({
          where: { userCustomerId: userId, storeId: ticket.storeId }
        });

        if (loyalty) {
          // Buscar todos los logs de este ticket para saber qué revertir
          const logs = await this.userLoyaltyLogRepo.find({
            where: { ticket_id: String(id) }
          });

          for (const log of logs) {
            // SI el log tiene coupon_id, significa que restó visitas/puntos (canje)
            // SI no, sumó puntos por la compra normal.
            // Para revertir, restamos el delta del log. 
            // Si delta era -50 (canje), restamos -50 -> sumamos 50. Correcto.
            // Si delta era +10 (compra), restamos 10 -> sumamos -10. Correcto.
            loyalty.points = Math.max(0, (Number(loyalty.points) || 0) - (Number(log.pointsDelta) || 0));
            loyalty.visits = Math.max(0, (Number(loyalty.visits) || 0) - (Number(log.visitsDelta) || 0));
          }
          await this.userLoyaltyRepo.save(loyalty);
          // Borrar logs
          await this.userLoyaltyLogRepo.remove(logs);
        }
      }
    }

    // 2. Borrar items
    await this.ticketItemRepo.delete({ ticketId: String(id) });

    // 3. Borrar ticket
    return this.ticketRepo.delete(id);
  }
}
