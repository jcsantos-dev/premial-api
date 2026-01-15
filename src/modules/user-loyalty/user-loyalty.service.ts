import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUserLoyaltyDto } from './dto/create-user-loyalty.dto';
import { UpdateUserLoyaltyDto } from './dto/update-user-loyalty.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLoyalty } from 'src/entities/UserLoyalty';
import { Repository, ILike } from 'typeorm';
import { User } from 'src/entities/User';
import { UserCustomer } from 'src/entities/UserCustomer';
import { UserRole } from 'src/entities/UserRole';
import { UserPlatform } from 'src/entities/UserPlatform';
import { UserAuth } from 'src/entities/UserAuth';
import { AuthType } from 'src/entities/AuthType';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserLoyaltyService {
  constructor(
    @InjectRepository(UserLoyalty)
    private repo: Repository<UserLoyalty>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(UserCustomer)
    private userCustomerRepo: Repository<UserCustomer>,
    @InjectRepository(UserRole)
    private roleRepo: Repository<UserRole>,
    @InjectRepository(UserPlatform)
    private userPlatformRepo: Repository<UserPlatform>,
    @InjectRepository(UserAuth)
    private userAuthRepo: Repository<UserAuth>,
    @InjectRepository(AuthType)
    private authTypeRepo: Repository<AuthType>,
  ) { }

  findAll() {
    return this.repo.find({
      relations: ['user', 'user.userCustomers'],
    });
  }

  findOne(id: string) {
    return this.repo.findOne({
      where: { id },
      relations: ['user', 'user.userCustomers'],
    });
  }

  findByStore(storeId: string) {
    return this.repo.find({
      where: { storeId: storeId.toString() },
      relations: ['user', 'user.userCustomers', 'store'],
    });
  }

  async create(dto: CreateUserLoyaltyDto) {
    const { email, firstName, lastName, phone, birthdate, password, storeId } = dto;

    // 1. Buscar si ya existe el usuario globalmente
    // Primero por teléfono via UserCustomer
    let userCustomer = await this.userCustomerRepo.findOne({
      where: { phone },
      relations: ['user'],
    });

    let user: User | null = userCustomer?.user || null;

    // Si no, por email via User
    if (!user) {
      user = await this.userRepo.findOne({ where: { email } });
    }

    if (!user) {
      // 1.1 Crear Usuario Base
      user = this.userRepo.create({
        email,
        phone,
        firstName,
        lastName,
        uuid: crypto.randomUUID(),
        createdAt: new Date(),
      });
      user = await this.userRepo.save(user);

      // 1.2 Crear Credenciales (UserAuth) si viene password
      if (password) {
        let authType = await this.authTypeRepo.findOne({ where: { name: 'local' } });
        if (!authType) authType = await this.authTypeRepo.findOne({ where: { id: '1' } });

        if (authType) {
          const hashedPassword = await bcrypt.hash(password, 10);
          const userAuth = this.userAuthRepo.create({
            userId: user.id,
            authTypeId: Number(authType.id),
            authUserProviderId: email,
            passwordHash: hashedPassword,
            createdAt: new Date(),
          });
          await this.userAuthRepo.save(userAuth);
        }
      }

      // 1.3 Perfil de Cliente (UserCustomer)
      userCustomer = this.userCustomerRepo.create({
        user,
        phone,
        birthdate,
      });
      userCustomer = await this.userCustomerRepo.save(userCustomer);

      // 1.4 Rol de Plataforma (UserPlatform)
      let role = await this.roleRepo.findOne({ where: { name: 'user_customer' } });
      if (!role) role = await this.roleRepo.findOne({ where: { name: 'customer' } });

      if (role) {
        const userPlatform = this.userPlatformRepo.create({
          userId: user.id,
          roleId: role.id,
        });
        await this.userPlatformRepo.save(userPlatform);
      }
    } else {
      // Si el usuario existe, asegurarnos de que tenga un perfil UserCustomer
      if (!userCustomer) {
        userCustomer = await this.userCustomerRepo.findOne({
          where: { user: { id: user.id } }
        });

        if (!userCustomer) {
          userCustomer = this.userCustomerRepo.create({
            user,
            phone,
            birthdate,
          });
          userCustomer = await this.userCustomerRepo.save(userCustomer);
        }
      }
    }

    // 2. Vincular a la Tienda (UserLoyalty)
    // El DDL indica que user_loyalty apunta a user_id (llave fk_user_loyalty_user)
    // pero la columna en el código restaurado es userCustomerId.
    // Para resolver el error de constraint "Key (user_customer_id)=(12) is not present in table user"
    // debemos pasar el ID del USUARIO en esa columna si el constraint apunta a la tabla user.

    let userLoyalty = await this.repo.findOne({
      where: {
        userCustomerId: user.id, // Pasamos user.id para satisfacer fk_user_loyalty_user
        storeId: storeId,
      },
    });

    if (userLoyalty) {
      throw new BadRequestException('El cliente ya está registrado en esta tienda');
    }

    userLoyalty = this.repo.create({
      userCustomerId: user.id, // Pasamos user.id
      storeId: storeId,
      points: 0,
      visits: 0,
      referrals: 0,
      redeemedPoints: 0,
    });

    return this.repo.save(userLoyalty);
  }

  async update(id: string, dto: UpdateUserLoyaltyDto) {
    const userLoyalty = await this.repo.findOne({
      where: { id },
      relations: ['userCustomer', 'userCustomer.user'],
    });

    if (!userLoyalty) throw new NotFoundException('UserLoyalty not found');

    const { email, firstName, lastName, phone, birthdate } = dto;

    // Actualizar datos del usuario global (si el ID almacenado en userCustomerId apunta a User)
    // Buscamos el usuario real usando el valor guardado
    const user = await this.userRepo.findOne({ where: { id: userLoyalty.userCustomerId } });

    if (user) {
      if (email) user.email = email;
      if (phone) user.phone = phone;
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      await this.userRepo.save(user);

      // Actualizar perfil UserCustomer
      let customer = await this.userCustomerRepo.findOne({
        where: { user: { id: user.id } }
      });

      if (customer) {
        if (birthdate) customer.birthdate = birthdate;
        if (phone) customer.phone = phone;
        await this.userCustomerRepo.save(customer);
      }
    }

    const entity = await this.repo.preload({ id, ...dto });
    if (!entity) throw new NotFoundException('Could not preload UserLoyalty');
    return this.repo.save(entity);
  }

  async remove(id: string) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('UserLoyalty not found');
    return this.repo.remove(entity);
  }

  async search(storeId: string, query: string) {
    // Buscar en UserLoyalty filtrando por tienda y uniendo con User y UserCustomer
    return this.repo.find({
      where: [
        {
          storeId,
          user: { userCustomers: { phone: ILike(`%${query}%`) } }
        },
        {
          storeId,
          user: { phone: ILike(`%${query}%`) }
        },
        {
          storeId,
          user: { firstName: ILike(`%${query}%`) }
        },
        {
          storeId,
          user: { lastName: ILike(`%${query}%`) }
        }
      ],
      relations: ['user', 'user.userCustomers'],
      take: 20,
    });
  }
}
