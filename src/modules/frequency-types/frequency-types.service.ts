import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFrequencyTypeDto } from './dto/create-frequency-type.dto';
import { UpdateFrequencyTypeDto } from './dto/update-frequency-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FrequencyType } from 'src/entities/FrequencyType';

@Injectable()
export class FrequencyTypesService {
  constructor(
    @InjectRepository(FrequencyType)
    private repo: Repository<FrequencyType>,
  ) {}

  findAll() {
    return this.repo.find(); // devuelve todos los FrequencyTypes
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async create(dto: CreateFrequencyTypeDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateFrequencyTypeDto) {
    const entity = await this.repo.preload({ id, ...dto });
    if (!entity) throw new NotFoundException('FrequencyType not found');
    return this.repo.save(entity);
  }

  async remove(id: string) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('FrequencyType not found');
    return this.repo.remove(entity);
  }
}
