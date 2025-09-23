import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStreakConfDto } from './dto/create-streak-conf.dto';
import { UpdateStreakConfDto } from './dto/update-streak-conf.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StreakConf } from 'src/entities/StreakConf';
import { Repository } from 'typeorm';

@Injectable()
export class StreakConfService {
  constructor(
    @InjectRepository(StreakConf)
    private repo: Repository<StreakConf>,
  ) {}

  findAll() {
    return this.repo.find(); // devuelve todos los couponTypes
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async create(dto: CreateStreakConfDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateStreakConfDto) {
    const entity = await this.repo.preload({ id, ...dto });
    if (!entity) throw new NotFoundException('StreakConf not found');
    return this.repo.save(entity);
  }

  async remove(id: string) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('StreakConf not found');
    return this.repo.remove(entity);
  }
}
