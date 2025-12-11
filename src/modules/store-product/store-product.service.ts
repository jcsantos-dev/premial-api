import { Injectable } from '@nestjs/common';
import { CreateStoreProductDto } from './dto/create-store-product.dto';
import { UpdateStoreProductDto } from './dto/update-store-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreProduct } from 'src/entities/StoreProduct';
import { Repository } from 'typeorm';

@Injectable()
export class StoreProductService {
  constructor(
    @InjectRepository(StoreProduct)
    private repo: Repository<StoreProduct>,
  ) {}

  create(createStoreProductDto: CreateStoreProductDto) {
    const dtoFixed = {
      ...createStoreProductDto,
      storeId: String(createStoreProductDto.storeId),
    };

    const entity = this.repo.create(dtoFixed);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ relations: ['store'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['store'] });
  }

  findByStore(storeId: number) {
    return this.repo.find({
      where: { storeId: String(storeId) },
      relations: ['store'],
    });
  }

  async update(id: number, updateStoreProductDto: UpdateStoreProductDto) {
    const dtoFixed = {
      ...updateStoreProductDto,
      storeId: updateStoreProductDto.storeId
        ? String(updateStoreProductDto.storeId)
        : undefined,
    };

    await this.repo.update(id, dtoFixed);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
