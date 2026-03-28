/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserStoreDto } from './dto/create-user-store.dto';
import { UpdateUserStoreDto } from './dto/update-user-store.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserStore } from 'src/entities/UserStore';
import { UserRole } from 'src/entities/UserRole';

@Injectable()
export class UserStoreService {
  constructor(
    @InjectRepository(UserStore)
    private repo: Repository<UserStore>,
    @InjectRepository(UserRole)
    private roleRepo: Repository<UserRole>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async existsByUserId(userId: string): Promise<boolean> {
    const count = await this.repo.count({ where: { user: { id: userId } } });
    return count > 0;
  }

  async findByUserId(userId: string) {
    return this.repo.findOne({
      where: { userId },
      relations: ['role', 'store'],
    });
  }

  // 🔹 Nuevo método para buscar por store
  findByStore(storeId: string) {
    return this.repo.find({
      where: { storeId: storeId.toString() }, // convertir a número si tu storeId es bigint
      relations: ['user'], // incluir relaciones si es necesario
    });
  }

  async create(dto: CreateUserStoreDto) {
    const entity = this.repo.create(dto);

    // Si roleId no es numérico, buscar el rol por nombre
    if (dto.roleId && isNaN(Number(dto.roleId))) {
      // Intentar encontrar el rol por nombre (insensible a mayúsculas/minúsculas si es posible)
      // Usando ILike o simplemente buscando varias opciones comunes
      const role = await this.roleRepo.findOne({
        where: [
          { name: dto.roleId },
          { name: dto.roleId.toLowerCase() },
          { name: dto.roleId.charAt(0).toUpperCase() + dto.roleId.slice(1).toLowerCase() }, // Admin
        ]
      });
      if (role) {
        entity.roleId = role.id;
      } else {
        // Por defecto si no se encuentra, intentar buscar 'admin' como fallback
        const adminRole = await this.roleRepo.findOne({ where: { name: 'admin' } });
        if (adminRole) {
          entity.roleId = adminRole.id;
        } else {
          entity.roleId = null;
        }
      }
    }

    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateUserStoreDto) {
    const entity = await this.repo.preload({ id, ...dto });
    if (!entity) throw new NotFoundException('UserStore not found');

    // Si roleId no es numérico, buscar el rol por nombre
    if (dto.roleId && isNaN(Number(dto.roleId))) {
      // Intentar encontrar el rol por nombre (insensible a mayúsculas/minúsculas si es posible)
      const role = await this.roleRepo.findOne({
        where: [
          { name: dto.roleId },
          { name: dto.roleId.toLowerCase() },
          { name: dto.roleId.charAt(0).toUpperCase() + dto.roleId.slice(1).toLowerCase() },
        ]
      });
      if (role) {
        entity.roleId = role.id;
      } else {
        const adminRole = await this.roleRepo.findOne({ where: { name: 'admin' } });
        if (adminRole) {
          entity.roleId = adminRole.id;
        } else {
          entity.roleId = null;
        }
      }
    }

    return this.repo.save(entity);
  }

  async remove(id: string) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('UserStore not found');
    return this.repo.remove(entity);
  }
}
