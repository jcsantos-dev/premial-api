import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UserLoyaltyService } from './user-loyalty.service';
import { CreateUserLoyaltyDto } from './dto/create-user-loyalty.dto';
import { UpdateUserLoyaltyDto } from './dto/update-user-loyalty.dto';

@Controller('user-loyalty')
export class UserLoyaltyController {
  constructor(private readonly userLoyaltyService: UserLoyaltyService) { }

  @Get('stores-by-userid')
  @UseGuards(JwtAuthGuard)
  getStoresByUserId(@Request() req: any) {
    const userId = req.user.sub;
    return this.userLoyaltyService.getStoresByUserId(userId);
  }

  @Get('by-store/:storeId')
  @UseGuards(JwtAuthGuard)
  getUserLoyaltyByStore(@Request() req: any, @Param('storeId') storeId: string) {
    const userId = req.user.sub;
    return this.userLoyaltyService.getUserLoyaltyByUserAndStore(userId, storeId);
  }

  @Get('by-store/:storeId/full')
  @UseGuards(JwtAuthGuard)
  getFullDashboard(@Request() req: any, @Param('storeId') storeId: string) {
    const userId = req.user.sub;
    return this.userLoyaltyService.getFullDashboardData(userId, storeId);
  }

  @Get('search')
  search(
    @Query('query') query: string,
    @Query('storeId') storeId?: string,
  ) {
    return this.userLoyaltyService.search(storeId, query);
  }

  @Get('verify-phone')
  verifyPhone(
    @Query('phone') phone: string,
    @Query('storeId') storeId: string,
  ) {
    return this.userLoyaltyService.verifyPhone(phone, storeId);
  }

  @Get('store/:storeId')
  findByStore(@Param('storeId') storeId: string) {
    return this.userLoyaltyService.findByStore(storeId);
  }

  @Post()
  create(@Body() createUserLoyaltyDto: CreateUserLoyaltyDto) {
    return this.userLoyaltyService.create(createUserLoyaltyDto);
  }

  @Get()
  findAll() {
    return this.userLoyaltyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userLoyaltyService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserLoyaltyDto: UpdateUserLoyaltyDto,
  ) {
    return this.userLoyaltyService.update(id, updateUserLoyaltyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userLoyaltyService.remove(id);
  }
}
