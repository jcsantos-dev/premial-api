import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from 'src/entities/Store';
import { Repository } from 'typeorm';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private repo: Repository<Store>,
  ) {}

  findAll() {
    return this.repo.find({
      relations: [
        'coupons',
        'levelConfs.levelType',
        'programs.programType',
        'streakConfs',
        'userLevels',
        //'userLoyalties',
        //'userLoyaltyLogs',
        //'userStreaks',
      ],
    }); // devuelve todos los couponTypes
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
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
