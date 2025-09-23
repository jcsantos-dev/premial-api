import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStreakTypeDto } from './dto/create-streak-type.dto';
import { UpdateStreakTypeDto } from './dto/update-streak-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StreakType } from 'src/entities/StreakType';

@Injectable()
export class StreakTypesService {
  constructor(
    @InjectRepository(StreakType)
    private repo: Repository<StreakType>,
  ) {}

  findAll() {
    return this.repo.find(); // devuelve todos los StreakTypes
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async create(dto: CreateStreakTypeDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateStreakTypeDto) {
    const entity = await this.repo.preload({ id, ...dto });
    if (!entity) throw new NotFoundException('StreakType not found');
    return this.repo.save(entity);
  }

  async remove(id: string) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('StreakType not found');
    return this.repo.remove(entity);
  }
}
