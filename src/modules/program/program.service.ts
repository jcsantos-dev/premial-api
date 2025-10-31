import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Program } from 'src/entities/Program';

@Injectable()
export class ProgramService {
  constructor(
    @InjectRepository(Program)
    private repo: Repository<Program>,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['programType'] });
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  findByStore(storeId: string) {
    return this.repo.find({
      where: { storeId: storeId.toString() }, // convertir a número si tu storeId es bigint
      relations: ['programType'],
    });
  }

  async create(dto: CreateProgramDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateProgramDto) {
    const entity = await this.repo.preload({ id, ...dto });
    if (!entity) throw new NotFoundException('Program not found');
    return this.repo.save(entity);
  }

  async remove(id: string) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Program not found');
    return this.repo.remove(entity);
  }
}
