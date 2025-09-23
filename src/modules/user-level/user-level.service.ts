import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserLevelDto } from './dto/create-user-level.dto';
import { UpdateUserLevelDto } from './dto/update-user-level.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLevel } from 'src/entities/UserLevel';

@Injectable()
export class UserLevelService {
  constructor(
    @InjectRepository(UserLevel)
    private repo: Repository<UserLevel>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async create(dto: CreateUserLevelDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateUserLevelDto) {
    const entity = await this.repo.preload({ id, ...dto });
    if (!entity) throw new NotFoundException('UserLevel not found');
    return this.repo.save(entity);
  }

  async remove(id: string) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('UserLevel not found');
    return this.repo.remove(entity);
  }
}
