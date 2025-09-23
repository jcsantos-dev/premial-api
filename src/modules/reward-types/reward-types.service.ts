import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRewardTypeDto } from './dto/create-reward-type.dto';
import { UpdateRewardTypeDto } from './dto/update-reward-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RewardType } from '../../entities/RewardType';
import { Repository } from 'typeorm';

@Injectable()
export class RewardTypesService {
  constructor(
    @InjectRepository(RewardType)
    private repo: Repository<RewardType>,
  ) {}

  findAll() {
    return this.repo.find(); // devuelve todos los RewardTypes
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async create(dto: CreateRewardTypeDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateRewardTypeDto) {
    const entity = await this.repo.preload({ id, ...dto });
    if (!entity) throw new NotFoundException('RewardType not found');
    return this.repo.save(entity);
  }

  async remove(id: string) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('RewardType not found');
    return this.repo.remove(entity);
  }
}
