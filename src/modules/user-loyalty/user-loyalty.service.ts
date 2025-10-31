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
    return this.repo.find({
      relations: ['userCustomer', 'userCustomer.user'], // incluir la relación con UserCustomer y User
    });
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  // 🔹 Nuevo método para buscar por store
  findByStore(storeId: string) {
    return this.repo.find({
      where: { storeId: storeId.toString() }, // convertir a número si tu storeId es bigint
      relations: ['userCustomer', 'userCustomer.user'], // incluir la relación con UserCustomer
    });
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
