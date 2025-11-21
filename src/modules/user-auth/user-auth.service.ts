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
    private readonly userAuthRepository: Repository<UserAuth>,
  ) {}

  findAll() {
    return this.userAuthRepository.find({
      relations: ['user', 'authType'],
    });
  }

  findOne(id: string) {
    return this.userAuthRepository.findOne({ where: { id } });
  }

  async create(dto: CreateUserAuthDto) {
    const entity = this.userAuthRepository.create(dto);
    return this.userAuthRepository.save(entity);
  }

  async update(id: string, dto: UpdateUserAuthDto) {
    const entity = await this.userAuthRepository.preload({ id, ...dto });
    if (!entity) throw new NotFoundException('UserAuth not found');
    return this.userAuthRepository.save(entity);
  }

  async remove(id: string) {
    const entity = await this.userAuthRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('UserAuth not found');
    return this.userAuthRepository.remove(entity);
  }

  async findByEmail(email: string) {
    return this.userAuthRepository.findOne({
      where: { authUserProviderId: email },
      relations: ['user'],
    });
  }

  async findByUserId(userId: string) {
    return this.userAuthRepository.findOne({
      where: { user: { id: userId } },
    });
  }
}
