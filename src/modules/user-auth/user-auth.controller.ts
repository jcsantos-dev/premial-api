import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { CreateUserAuthDto } from './dto/create-user-auth.dto';
import { UpdateUserAuthDto } from './dto/update-user-auth.dto';

@Controller('user-auth')
export class UserAuthController {
  private readonly logger = new Logger(UserAuthController.name);
  constructor(private readonly userAuthsService: UserAuthService) { }

  @Post()
  create(@Req() req: Request, @Body() createUserAuthDto: CreateUserAuthDto) {
    // LOG DETALLADO
    this.logger.debug('=== CREATE USER AUTH ===');
    this.logger.debug(`Request URL: ${req.url}`);
    this.logger.debug(`Request Method: ${req.method}`);
    this.logger.debug(`Content-Type: ${req.headers['content-type']}`);
    this.logger.debug(`Raw Body: ${JSON.stringify(req.body)}`);
    this.logger.debug(`Parsed DTO: ${JSON.stringify(createUserAuthDto)}`);

    // VALIDACIÓN EXPLÍCITA EN EL CONTROLLER
    if (!createUserAuthDto.userId) {
      this.logger.error(`userId is missing or falsy: ${createUserAuthDto.userId}`);
      throw new BadRequestException('userId is required');
    }
    if (!createUserAuthDto.authTypeId) {
      this.logger.error(`authTypeId is missing or falsy: ${createUserAuthDto.authTypeId}`);
      throw new BadRequestException('authTypeId is required');
    }
    if (!createUserAuthDto.authUserProviderId) {
      this.logger.error(`authUserProviderId is missing or falsy: ${createUserAuthDto.authUserProviderId}`);
      throw new BadRequestException('authUserProviderId is required');
    }

    this.logger.debug('DTO validated successfully, calling service...');
    return this.userAuthsService.create(createUserAuthDto);
  }

  @Get()
  findAll() {
    return this.userAuthsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userAuthsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserAuthDto: UpdateUserAuthDto,
  ) {
    return this.userAuthsService.update(id, updateUserAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userAuthsService.remove(id);
  }
}
