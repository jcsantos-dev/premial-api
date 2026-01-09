import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserAuthDto } from './dto/create-user-auth.dto';
import { UpdateUserAuthDto } from './dto/update-user-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAuth } from 'src/entities/UserAuth';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserAuthService {
  constructor(
    @InjectRepository(UserAuth)
    private readonly userAuthRepository: Repository<UserAuth>,
  ) { }

  findAll() {
    return this.userAuthRepository.find({
      relations: ['user', 'authType'],
    });
  }

  findOne(id: string) {
    return this.userAuthRepository.findOne({ where: { id } });
  }

  async create(dto: CreateUserAuthDto) {
    console.log('=== SERVICE CREATE START ===');
    console.log('DTO recibido en service:', {
      userId: dto.userId,
      authTypeId: dto.authTypeId,
      authUserProviderId: dto.authUserProviderId,
      types: {
        userId: typeof dto.userId,
        authTypeId: typeof dto.authTypeId,
        authUserProviderId: typeof dto.authUserProviderId,
      }
    });

    // VALIDACIÓN DEFENSIVA - no confíes en que el controller ya validó
    if (dto.userId === undefined || dto.userId === null) {
      throw new Error('CRITICAL: userId is undefined in service layer');
    }
    if (dto.authTypeId === undefined || dto.authTypeId === null) {
      throw new Error('CRITICAL: authTypeId is undefined in service layer');
    }
    if (dto.authUserProviderId === undefined || dto.authUserProviderId === null) {
      throw new Error('CRITICAL: authUserProviderId is undefined in service layer');
    }

    // Encriptar el password si está presente
    let hashedPassword: string | null = null;
    if (dto.passwordHash) {
      const saltRounds = 10; // Número de rondas de sal
      hashedPassword = await bcrypt.hash(dto.passwordHash, saltRounds);
      console.log('Password encriptado correctamente');
    }

    // CREACIÓN MANUAL - NO usar this.userAuthRepository.create()
    const userAuth = new UserAuth();
    userAuth.userId = String(dto.userId); // Convertir explícitamente
    userAuth.authTypeId = Number(dto.authTypeId); // Convertir explícitamente
    userAuth.authUserProviderId = String(dto.authUserProviderId);
    userAuth.passwordHash = hashedPassword || null;
    userAuth.createdAt = new Date();

    console.log('Entidad creada manualmente:', userAuth);

    try {
      const result = await this.userAuthRepository.save(userAuth);
      console.log('Resultado guardado:', result);
      return result;
    } catch (error) {
      console.error('Error completo:', {
        message: error.message,
        stack: error.stack,
        query: error.query,
        parameters: error.parameters,
        driverError: error.driverError,
      });
      throw error;
    }
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
