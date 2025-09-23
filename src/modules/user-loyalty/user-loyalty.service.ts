import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserLoyaltyDto } from './dto/create-user-loyalty.dto';
import { UpdateUserLoyaltyDto } from './dto/update-user-loyalty.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLoyalty } from 'src/entities/UserLoyalty';
import { Repository } from 'typeorm';

@Injectable()
export class UserLoyaltyService {
  constructor(
    @InjectRepository(UserLoyalty)
    private repo: Repository<UserLoyalty>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async create(dto: CreateUserLoyaltyDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateUserLoyaltyDto) {
    const entity = await this.repo.preload({ id, ...dto });
    if (!entity) throw new NotFoundException('UserLoyalty not found');
    return this.repo.save(entity);
  }

  async remove(id: string) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('UserLoyalty not found');
    return this.repo.remove(entity);
  }
}
