import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLevelConfDto } from './dto/create-level-conf.dto';
import { UpdateLevelConfDto } from './dto/update-level-conf.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LevelConf } from 'src/entities/LevelConf';
import { Repository } from 'typeorm';

@Injectable()
export class LevelConfService {
  constructor(
    @InjectRepository(LevelConf)
    private repo: Repository<LevelConf>,
  ) {}

  findAll() {
    return this.repo.find(); // devuelve todos los couponTypes
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async create(dto: CreateLevelConfDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateLevelConfDto) {
    const entity = await this.repo.preload({ id, ...dto });
    if (!entity) throw new NotFoundException('LevelConf not found');
    return this.repo.save(entity);
  }

  async remove(id: string) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('LevelConf not found');
    return this.repo.remove(entity);
  }
}
