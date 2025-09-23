import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLoyaltyActionTypeDto } from './dto/create-loyalty-action-type.dto';
import { UpdateLoyaltyActionTypeDto } from './dto/update-loyalty-action-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoyaltyActionType } from 'src/entities/LoyaltyActionType';

@Injectable()
export class LoyaltyActionTypesService {
  constructor(
    @InjectRepository(LoyaltyActionType)
    private repo: Repository<LoyaltyActionType>,
  ) {}

  findAll() {
    return this.repo.find(); // devuelve todos los LoyaltyActionTypes
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async create(dto: CreateLoyaltyActionTypeDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateLoyaltyActionTypeDto) {
    const entity = await this.repo.preload({ id, ...dto });
    if (!entity) throw new NotFoundException('LoyaltyActionType not found');
    return this.repo.save(entity);
  }

  async remove(id: string) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('LoyaltyActionType not found');
    return this.repo.remove(entity);
  }
}
