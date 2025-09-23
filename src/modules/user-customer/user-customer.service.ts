import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserCustomerDto } from './dto/create-user-customer.dto';
import { UpdateUserCustomerDto } from './dto/update-user-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCustomer } from 'src/entities/UserCustomer';

@Injectable()
export class UserCustomerService {
  constructor(
    @InjectRepository(UserCustomer)
    private repo: Repository<UserCustomer>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async create(dto: CreateUserCustomerDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateUserCustomerDto) {
    const entity = await this.repo.preload({ id, ...dto });
    if (!entity) throw new NotFoundException('UserCustomer not found');
    return this.repo.save(entity);
  }

  async remove(id: string) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('UserCustomer not found');
    return this.repo.remove(entity);
  }
}
