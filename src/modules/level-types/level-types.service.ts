import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLevelTypeDto } from './dto/create-level-type.dto';
import { UpdateLevelTypeDto } from './dto/update-level-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LevelType } from 'src/entities/LevelType';
import { Repository } from 'typeorm';

@Injectable()
export class LevelTypesService {
  constructor(
    @InjectRepository(LevelType)
    private repo: Repository<LevelType>,
  ) {}

  findAll() {
    return this.repo.find(); // devuelve todos los LevelTypes
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async create(dto: CreateLevelTypeDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateLevelTypeDto) {
    const entity = await this.repo.preload({ id, ...dto });
    if (!entity) throw new NotFoundException('LeveyType not found');
    return this.repo.save(entity);
  }

  async remove(id: string) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('LeveyType not found');
    return this.repo.remove(entity);
  }
}
