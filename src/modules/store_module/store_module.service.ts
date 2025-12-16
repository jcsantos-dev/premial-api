import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStoreModuleDto } from './dto/create-store_module.dto';
import { UpdateStoreModuleDto } from './dto/update-store_module.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreModule } from '../../entities/StoreModule';

@Injectable()
export class StoreModuleService {
  constructor(
    @InjectRepository(StoreModule)
    private repo: Repository<StoreModule>,
  ) {}

  findAll() {
    return this.repo.find({
      relations: ['store', 'moduleType'],
    });
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['store', 'moduleType'],
    });
  }

  findByStore(storeId: string) {
    return this.repo.find({
      where: { storeId },
      relations: ['moduleType'],
    });
  }

  async create(dto: CreateStoreModuleDto) {
    const entity = this.repo.create({
      ...dto,
      isEnabled: dto.isEnabled ?? true,
    });
    return this.repo.save(entity);
  }

  async update(id: number, dto: UpdateStoreModuleDto) {
    const entity = await this.repo.preload({ id, ...dto });
    if (!entity) throw new NotFoundException('StoreModule not found');
    return this.repo.save(entity);
  }

  async remove(id: number) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('StoreModule not found');
    return this.repo.remove(entity);
  }
}
