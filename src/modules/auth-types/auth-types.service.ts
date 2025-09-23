import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthTypeDto } from './dto/create-auth-type.dto';
import { UpdateAuthTypeDto } from './dto/update-auth-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthType } from 'src/entities/AuthType';

@Injectable()
export class AuthTypesService {
  constructor(
    @InjectRepository(AuthType)
    private repo: Repository<AuthType>,
  ) {}

  findAll() {
    return this.repo.find(); // devuelve todos los AuthTypes
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async create(dto: CreateAuthTypeDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateAuthTypeDto) {
    const entity = await this.repo.preload({ id, ...dto });
    if (!entity) throw new NotFoundException('AuthType not found');
    return this.repo.save(entity);
  }

  async remove(id: string) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('AuthType not found');
    return this.repo.remove(entity);
  }
}
