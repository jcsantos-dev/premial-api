import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserPlatformDto } from './dto/create-user-platform.dto';
import { UpdateUserPlatformDto } from './dto/update-user-platform.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPlatform } from 'src/entities/UserPlatform';

@Injectable()
export class UserPlatformService {
  constructor(
    @InjectRepository(UserPlatform)
    private repo: Repository<UserPlatform>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async create(dto: CreateUserPlatformDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateUserPlatformDto) {
    const entity = await this.repo.preload({ id, ...dto });
    if (!entity) throw new NotFoundException('UserPlatform not found');
    return this.repo.save(entity);
  }

  async remove(id: string) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('UserPlatform not found');
    return this.repo.remove(entity);
  }
}
