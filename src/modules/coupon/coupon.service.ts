import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from 'src/entities/Coupon';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private repo: Repository<Coupon>,
  ) { }

  findAll() {
    return this.repo.find();
  }

  findOne(uuid: string) {
    return this.repo.findOne({ where: { uuid } });
  }
  // 🔹 Nuevo método para buscar por store
  findByStore(storeId: string) {
    return this.repo.find({
      where: { storeId: storeId.toString() }, // convertir a número si tu storeId es bigint
    });
  }

  async create(dto: CreateCouponDto) {
    const entity = this.repo.create({
      ...dto,
      uuid: randomUUID(),
    });
    return this.repo.save(entity);
  }


  async update(uuid: string, dto: UpdateCouponDto) {
    const entity = await this.repo.preload({ uuid, ...dto });
    if (!entity) throw new NotFoundException('Coupon not found');
    return this.repo.save(entity);
  }

  async remove(uuid: string) {
    const entity = await this.repo.findOne({ where: { uuid } });
    if (!entity) throw new NotFoundException('Coupon not found');
    return this.repo.remove(entity);
  }
}
