import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthTypesService } from './auth-types.service';
import { CreateAuthTypeDto } from './dto/create-auth-type.dto';
import { UpdateAuthTypeDto } from './dto/update-auth-type.dto';

@Controller('auth-types')
export class AuthTypesController {
  constructor(private readonly authTypesService: AuthTypesService) {}

  @Post()
  create(@Body() createAuthTypeDto: CreateAuthTypeDto) {
    return this.authTypesService.create(createAuthTypeDto);
  }

  @Get()
  findAll() {
    return this.authTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authTypesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAuthTypeDto: UpdateAuthTypeDto,
  ) {
    return this.authTypesService.update(id, updateAuthTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authTypesService.remove(id);
  }
}
