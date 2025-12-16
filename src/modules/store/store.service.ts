import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from 'src/entities/Store';
import { Repository } from 'typeorm';
import { UserLoyalty } from 'src/entities/UserLoyalty';
import { UserLoyaltyLog } from 'src/entities/UserLoyaltyLog';
import { UserLevel } from 'src/entities/UserLevel';
import { UserStreak } from 'src/entities/UserStreak';
import { StoreProduct } from 'src/entities/StoreProduct';
import { Ticket } from 'src/entities/Ticket';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private repo: Repository<Store>,
    @InjectRepository(UserLoyalty)
    private userLoyaltyRepo: Repository<UserLoyalty>,
    @InjectRepository(UserLoyaltyLog)
    private userLoyaltyLogRepo: Repository<UserLoyaltyLog>,
    @InjectRepository(UserLevel)
    private userLevelRepo: Repository<UserLevel>,
    @InjectRepository(UserStreak)
    private userStreakRepo: Repository<UserStreak>,
    @InjectRepository(StoreProduct)
    private storeProductRepo: Repository<StoreProduct>,
    @InjectRepository(Ticket)
    private ticketRepo: Repository<Ticket>,
  ) {}

  findAll() {
    return this.repo.find({
      relations: [
        'coupons',
        'levelConfs.levelType',
        'programs.programType',
        'streakConfs',
        'userLevels',
        'userLoyalties',
        'userLoyaltyLogs',
        'userStreaks',
        'storeProducts',
        'storeTickets',
        'storeModules',
      ],
    }); // devuelve todos los couponTypes
  }

  async findOne(id: string) {
    const store = await this.repo.findOne({
      where: { id },
      relations: [
        'coupons',
        'levelConfs.levelType',
        'programs.programType',
        'streakConfs',
        'storeModules',
      ],
    });

    if (!store) return null;

    // Cargar relaciones pesadas con límites para evitar cuellos de botella
    const [
      userLoyalties,
      userLoyaltyLogs,
      userLevels,
      userStreaks,
      storeProducts,
      storeTickets,
    ] = await Promise.all([
      this.userLoyaltyRepo.find({ where: { storeId: id } }),
      this.userLoyaltyLogRepo.find({
        where: { storeId: id },
        order: { createdAt: 'DESC' },
        take: 200,
      }),
      this.userLevelRepo.find({ where: { storeId: id } }),
      this.userStreakRepo.find({ where: { storeId: id } }),
      this.storeProductRepo.find({
        where: { storeId: id },
        take: 200,
        relations: ['store'],
      }),
      this.ticketRepo.find({
        where: { storeId: id },
        relations: ['items'],
        order: { id: 'DESC' },
        take: 200,
      }),
    ]);

    return {
      ...store,
      userLoyalties,
      userLoyaltyLogs,
      userLevels,
      userStreaks,
      storeProducts,
      storeTickets,
    };
  }

  async create(dto: CreateStoreDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateStoreDto) {
    const entity = await this.repo.preload({ id, ...dto });
    if (!entity) throw new NotFoundException('Store not found');
    return this.repo.save(entity);
  }

  async remove(id: string) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Store not found');
    return this.repo.remove(entity);
  }
}
