import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserLoyaltyLogService } from './user-loyalty-log.service';
import { CreateUserLoyaltyLogDto } from './dto/create-user-loyalty-log.dto';
import { UpdateUserLoyaltyLogDto } from './dto/update-user-loyalty-log.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('user-loyalty-log')
export class UserLoyaltyLogController {
  constructor(private readonly userLoyaltyLogService: UserLoyaltyLogService) { }

  @Post()
  create(@Body() createUserLoyaltyLogDto: CreateUserLoyaltyLogDto) {
    return this.userLoyaltyLogService.create(createUserLoyaltyLogDto);
  }

  @Get()
  findAll() {
    return this.userLoyaltyLogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userLoyaltyLogService.findOne(id);
  }
  @Get('store/:storeId')
  findByStore(@Param('storeId') storeId: string) {
    return this.userLoyaltyLogService.findByStore(storeId);
  }

  @Get('mine/store/:storeId')
  @UseGuards(JwtAuthGuard)
  findMineByStore(@Request() req: any, @Param('storeId') storeId: string) {
    const userId = req.user.sub;
    return this.userLoyaltyLogService.findByUserAndStore(userId, storeId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserLoyaltyLogDto: UpdateUserLoyaltyLogDto,
  ) {
    return this.userLoyaltyLogService.update(id, updateUserLoyaltyLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userLoyaltyLogService.remove(id);
  }
}
