import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserStreakDto } from './dto/create-user-streak.dto';
import { UpdateUserStreakDto } from './dto/update-user-streak.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserStreak } from 'src/entities/UserStreak';

@Injectable()
export class UserStreakService {
  constructor(
    @InjectRepository(UserStreak)
    private repo: Repository<UserStreak>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async create(dto: CreateUserStreakDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateUserStreakDto) {
    const entity = await this.repo.preload({ id, ...dto });
    if (!entity) throw new NotFoundException('UserStreak not found');
    return this.repo.save(entity);
  }

  async remove(id: string) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('UserStreak not found');
    return this.repo.remove(entity);
  }
}
