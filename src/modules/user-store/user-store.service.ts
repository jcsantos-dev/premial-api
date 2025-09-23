import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserStoreDto } from './dto/create-user-store.dto';
import { UpdateUserStoreDto } from './dto/update-user-store.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserStore } from 'src/entities/UserStore';

@Injectable()
export class UserStoreService {
  constructor(
    @InjectRepository(UserStore)
    private repo: Repository<UserStore>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async create(dto: CreateUserStoreDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateUserStoreDto) {
    const entity = await this.repo.preload({ id, ...dto });
    if (!entity) throw new NotFoundException('UserStore not found');
    return this.repo.save(entity);
  }

  async remove(id: string) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('UserStore not found');
    return this.repo.remove(entity);
  }
}
