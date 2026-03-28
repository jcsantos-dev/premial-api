/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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
import { Coupon } from 'src/entities/Coupon';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

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
    @InjectRepository(Coupon)
    private couponRepo: Repository<Coupon>,
    private jwtService: JwtService,
  ) {}

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
    const { email, firstName, lastName, phone, birthdate, password, storeId } =
      dto;

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
        let authType = await this.authTypeRepo.findOne({
          where: { name: 'local' },
        });
        if (!authType)
          authType = await this.authTypeRepo.findOne({ where: { id: '1' } });

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
        birthdate: birthdate || '1900-01-01',
      });
      userCustomer = await this.userCustomerRepo.save(userCustomer);

      // 1.4 Rol de Plataforma (UserPlatform)
      let role = await this.roleRepo.findOne({
        where: { name: 'user_customer' },
      });
      if (!role)
        role = await this.roleRepo.findOne({ where: { name: 'customer' } });

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
          where: { user: { id: user.id } },
        });

        if (!userCustomer) {
          userCustomer = this.userCustomerRepo.create({
            user,
            phone,
            birthdate: birthdate || '1900-01-01',
          });
          userCustomer = await this.userCustomerRepo.save(userCustomer);
        }
      }

      // Asegurar que tenga credenciales (UserAuth) si se proporcionó password
      if (password) {
        let userAuth = await this.userAuthRepo.findOne({
          where: { user: { id: user.id } },
        });

        const hashedPassword = await bcrypt.hash(password, 10);

        if (!userAuth) {
          let authType = await this.authTypeRepo.findOne({
            where: { name: 'local' },
          });
          if (!authType)
            authType = await this.authTypeRepo.findOne({ where: { id: '1' } });

          if (authType) {
            userAuth = this.userAuthRepo.create({
              userId: user.id,
              authTypeId: Number(authType.id),
              authUserProviderId: email || user.email,
              passwordHash: hashedPassword,
              createdAt: new Date(),
            });
            await this.userAuthRepo.save(userAuth);
          }
        } else {
          // Si ya existe, actualizamos la contraseña por si acaso
          userAuth.passwordHash = hashedPassword;
          await this.userAuthRepo.save(userAuth);
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
      throw new BadRequestException(
        'El cliente ya está registrado en esta tienda',
      );
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
    const user = await this.userRepo.findOne({
      where: { id: userLoyalty.userCustomerId },
    });

    if (user) {
      if (email) user.email = email;
      if (phone) user.phone = phone;
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      await this.userRepo.save(user);

      // Actualizar perfil UserCustomer
      const customer = await this.userCustomerRepo.findOne({
        where: { user: { id: user.id } },
      });

      if (customer) {
        if (birthdate) customer.birthdate = birthdate;
        if (phone) customer.phone = phone;
        await this.userCustomerRepo.save(customer);
      }

      // Actualizar contraseña si viene en el DTO
      if (dto.password) {
        const userAuth = await this.userAuthRepo.findOne({
          where: { userId: user.id },
        });

        if (userAuth) {
          userAuth.passwordHash = await bcrypt.hash(dto.password, 10);
          await this.userAuthRepo.save(userAuth);
        }
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

  async search(storeId: string | undefined, query: string) {
    const whereConditions: any[] = [];

    // Si se proporciona storeId, buscar solo en esa tienda
    if (storeId) {
      whereConditions.push(
        {
          storeId,
          user: { userCustomers: { phone: ILike(`%${query}%`) } },
        },
        {
          storeId,
          user: { phone: ILike(`%${query}%`) },
        },
        {
          storeId,
          user: { firstName: ILike(`%${query}%`) },
        },
        {
          storeId,
          user: { lastName: ILike(`%${query}%`) },
        },
      );
    } else {
      // Si no se proporciona storeId, buscar en todos los stores
      whereConditions.push(
        { user: { userCustomers: { phone: ILike(`%${query}%`) } } },
        { user: { phone: ILike(`%${query}%`) } },
        { user: { firstName: ILike(`%${query}%`) } },
        { user: { lastName: ILike(`%${query}%`) } },
      );
    }

    return this.repo.find({
      where: whereConditions,
      relations: ['user', 'user.userCustomers'],
      take: 20,
    });
  }

  async getStoresByUserId(userId: string) {
    // Obtener todas las user_loyalty del usuario y retornar info básica de tiendas
    const userLoyalties = await this.repo.find({
      where: { user: { id: userId } },
      relations: ['store'],
      select: [
        'id',
        'storeId',
        'points',
        'visits',
        'referrals',
        'redeemedPoints',
      ],
    });

    // Retornar un array con info de tiendas enriquecida
    return userLoyalties.map((loyalty) => ({
      id: loyalty.id,
      storeId: loyalty.storeId,
      points: loyalty.points,
      visits: loyalty.visits,
      store: loyalty.store,
    }));
  }

  async getUserLoyaltyByUserAndStore(userId: string, storeId: string) {
    // Obtener la loyalty info específica para una tienda del usuario
    const userLoyalty = await this.repo.findOne({
      where: {
        user: { id: userId },
        storeId: storeId,
      },
      relations: ['store', 'user', 'user.userCustomers'],
    });

    if (!userLoyalty) {
      throw new NotFoundException('No tienes acceso a esta tienda');
    }

    return userLoyalty;
  }

  async getFullDashboardData(userId: string, storeId: string) {
    const userLoyalty = await this.getUserLoyaltyByUserAndStore(
      userId,
      storeId,
    );
    const coupons = await this.couponRepo.find({
      where: { storeId, isActive: true },
    });

    return {
      userLoyalty,
      coupons,
    };
  }

  async verifyPhone(phone: string, storeId: string) {
    // 1. Buscar en UserCustomer (perfil global por teléfono)
    const userCustomer = await this.userCustomerRepo.findOne({
      where: { phone },
      relations: ['user'],
    });

    if (!userCustomer) {
      return { status: 'NEW_USER' };
    }

    // 2. Si existe el perfil, ver si ya está vinculado a ESTA tienda
    const userLoyalty = await this.repo.findOne({
      where: {
        userCustomerId: userCustomer.user.id,
        storeId: storeId,
      },
    });

    if (userLoyalty) {
      return {
        status: 'FOUND_LOCAL',
        user: userCustomer.user,
        userCustomer,
      };
    }

    // 3. Existe en plataforma pero NO en esta tienda
    return {
      status: 'FOUND_GLOBAL',
      user: userCustomer.user,
      userCustomer,
    };
  }

  async sendPasswordResetLink(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Generar un token JWT seguro con expiración de 1 hora
    const token = this.jwtService.sign(
      {
        email: user.email,
        sub: user.id,
        purpose: 'password_reset',
      },
      { expiresIn: '1h' },
    );

    // Link real para el cliente (apuntando al puerto 4300)
    const resetLink = `http://localhost:4300/reset-password?token=${token}&email=${user.email}`;

    console.log(
      `[SECURE] Link de reset generado para ${user.email}: ${resetLink}`,
    );

    return {
      message: 'Link de recuperación generado con éxito (Válido por 1 hora)',
      debug_link: resetLink,
    };
  }

  async resetPassword(token: string, email: string, newPassword: string) {
    console.log(`[RESET] Iniciando reset para: ${email}`);
    try {
      // 1. Verificar JWT
      let payload: any;
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        payload = this.jwtService.verify(token);
        console.log(`[RESET] Payload decodificado:`, payload);
      } catch (e) {
        console.error(`[RESET] Error verificando JWT:`, e.message);
        throw new BadRequestException(
          'El enlace de recuperación no es válido o ha expirado.',
        );
      }

      if (payload.email !== email || payload.purpose !== 'password_reset') {
        console.warn(
          `[RESET] Email o propósito no coinciden: expected ${email}, got ${payload.email}`,
        );
        throw new BadRequestException('Token no válido para esta cuenta.');
      }

      // Intentar encontrar UserAuth por varias vías
      let userAuth = await this.userAuthRepo.findOne({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        where: { userId: payload.sub },
      });

      if (!userAuth) {
        console.log(
          `[RESET] No encontrado por userId directo, intentando por relación...`,
        );
        userAuth = await this.userAuthRepo.findOne({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          where: { user: { id: payload.sub } },
        });
      }

      if (!userAuth) {
        console.log(
          `[RESET] No encontrado por ID, intentando por authUserProviderId (email)...`,
        );
        userAuth = await this.userAuthRepo.findOne({
          where: { authUserProviderId: email },
        });
      }

      if (!userAuth) {
        console.warn(
          `[RESET] Usuario con ID ${payload.sub} no tiene registro en UserAuth. Intentando crear uno...`,
        );

        // 2.1 Verificar que el usuario realmente exista
        const user = await this.userRepo.findOne({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          where: { id: payload.sub },
        });
        if (!user) {
          console.error(
            `[RESET] Usuario con ID ${payload.sub} no existe en la tabla User`,
          );
          throw new BadRequestException('Usuario no encontrado.');
        }

        // 2.2 Buscar tipo de auth 'local'
        let authType = await this.authTypeRepo.findOne({
          where: { name: 'local' },
        });
        if (!authType)
          authType = await this.authTypeRepo.findOne({ where: { id: '1' } });

        if (!authType) {
          throw new BadRequestException(
            'Configuración de autenticación no encontrada.',
          );
        }

        // 2.3 Crear registro UserAuth nuevo
        userAuth = this.userAuthRepo.create({
          userId: user.id,
          authTypeId: Number(authType.id),
          authUserProviderId: user.email, // Usamos el email del usuario real
          passwordHash: '', // Se actualizará abajo
          createdAt: new Date(),
        });
      }

      console.log(
        `[RESET] Actualizando contraseña para UserAuth ID: ${userAuth.id || 'NUEVO'}...`,
      );

      // 3. Actualizar password usando bcrypt
      userAuth.passwordHash = await bcrypt.hash(newPassword, 10);
      await this.userAuthRepo.save(userAuth);

      console.log(
        `[RESET] Contraseña actualizada exitosamente para ID: ${payload.sub}`,
      );
      return { message: 'Contraseña actualizada con éxito' };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.name === 'TokenExpiredError') {
        throw new BadRequestException(
          'El link ha expirado (1 hora de validez).',
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.error(`[RESET] Error final:`, error.message);
      throw error;
    }
  }
}
