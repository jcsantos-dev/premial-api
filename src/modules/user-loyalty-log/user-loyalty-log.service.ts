import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserLoyaltyLogDto } from './dto/create-user-loyalty-log.dto';
import { UpdateUserLoyaltyLogDto } from './dto/update-user-loyalty-log.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLoyaltyLog } from 'src/entities/UserLoyaltyLog';
import { Repository } from 'typeorm';

@Injectable()
export class UserLoyaltyLogService {
  constructor(
    @InjectRepository(UserLoyaltyLog)
    private repo: Repository<UserLoyaltyLog>,
  ) { }

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  // 🔹 Nuevo método para buscar por store
  findByStore(storeId: string) {
    return this.repo.find({
      where: { storeId: storeId.toString() },
      relations: ['loyaltyActionType'],
      order: { createdAt: 'DESC' },
    });
  }

  // 🔹 Nuevo método para buscar por usuario y store (Personal de Customer)
  findByUserAndStore(userId: string, storeId: string) {
    return this.repo.find({
      where: {
        userId: userId,
        storeId: storeId,
      },
      relations: ['loyaltyActionType'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(dto: CreateUserLoyaltyLogDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateUserLoyaltyLogDto) {
    const entity = await this.repo.preload({ id, ...dto });
    if (!entity) throw new NotFoundException('UserLoyaltyLog not found');
    return this.repo.save(entity);
  }

  async remove(id: string) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('UserLoyaltyLog not found');
    return this.repo.remove(entity);
  }
}
