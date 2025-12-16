import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateModuleTypeDto } from './dto/create-module_type.dto';
import { UpdateModuleTypeDto } from './dto/update-module_type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModuleType } from '../../entities/ModuleType';

@Injectable()
export class ModuleTypeService {
  constructor(
    @InjectRepository(ModuleType)
    private repo: Repository<ModuleType>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async create(dto: CreateModuleTypeDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(id: number, dto: UpdateModuleTypeDto) {
    const entity = await this.repo.preload({ id, ...dto });
    if (!entity) throw new NotFoundException('ModuleType not found');
    return this.repo.save(entity);
  }

  async remove(id: number) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('ModuleType not found');
    return this.repo.remove(entity);
  }
}
