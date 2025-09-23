import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProgramTypeDto } from './dto/create-program-type.dto';
import { UpdateProgramTypeDto } from './dto/update-program-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProgramType } from '../../entities/ProgramType';
import { Repository } from 'typeorm';

@Injectable()
export class ProgramTypesService {
  constructor(
    @InjectRepository(ProgramType)
    private repo: Repository<ProgramType>,
  ) {}

  findAll() {
    return this.repo.find(); // devuelve todos los programTypes
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async create(dto: CreateProgramTypeDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateProgramTypeDto) {
    const entity = await this.repo.preload({ id, ...dto });
    if (!entity) throw new NotFoundException('ProgramType not found');
    return this.repo.save(entity);
  }

  async remove(id: string) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('ProgramType not found');
    return this.repo.remove(entity);
  }
}
