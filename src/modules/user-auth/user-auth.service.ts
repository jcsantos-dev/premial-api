import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserAuthDto } from './dto/create-user-auth.dto';
import { UpdateUserAuthDto } from './dto/update-user-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAuth } from 'src/entities/UserAuth';
import { Repository } from 'typeorm';

@Injectable()
export class UserAuthService {
  constructor(
    @InjectRepository(UserAuth)
    private repo: Repository<UserAuth>,
  ) {}

  findAll() {
    return this.repo.find({
      relations: ['user', 'authType'],
    });
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async create(dto: CreateUserAuthDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateUserAuthDto) {
    const entity = await this.repo.preload({ id, ...dto });
    if (!entity) throw new NotFoundException('UserAuth not found');
    return this.repo.save(entity);
  }

  async remove(id: string) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('UserAuth not found');
    return this.repo.remove(entity);
  }

  async findByEmail(email: string) {
    return this.repo.findOne({
      where: { authUserProviderId: email },
      relations: ['user'],
    });
  }
}
