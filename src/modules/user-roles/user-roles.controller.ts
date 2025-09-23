import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserRolesService } from './user-roles.service';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Controller('user-roles')
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @Post()
  create(@Body() createUserRolesDto: CreateUserRoleDto) {
    return this.userRolesService.create(createUserRolesDto);
  }

  @Get()
  findAll() {
    return this.userRolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userRolesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserRolesDto: UpdateUserRoleDto,
  ) {
    return this.userRolesService.update(id, updateUserRolesDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userRolesService.remove(id);
  }
}
