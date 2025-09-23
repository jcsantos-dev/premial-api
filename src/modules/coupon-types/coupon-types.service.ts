import { CouponType } from './../../entities/CouponType';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCouponTypeDto } from './dto/create-coupon-type.dto';
import { UpdateCouponTypeDto } from './dto/update-coupon-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CouponTypesService {
  constructor(
    @InjectRepository(CouponType)
    private repo: Repository<CouponType>,
  ) {}

  findAll() {
    return this.repo.find(); // devuelve todos los couponTypes
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async create(dto: CreateCouponTypeDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateCouponTypeDto) {
    const entity = await this.repo.preload({ id, ...dto });
    if (!entity) throw new NotFoundException('CouponType not found');
    return this.repo.save(entity);
  }

  async remove(id: string) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('CouponType not found');
    return this.repo.remove(entity);
  }
}
