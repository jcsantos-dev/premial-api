import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProgramTypesService } from './program-types.service';
import { CreateProgramTypeDto } from './dto/create-program-type.dto';
import { UpdateProgramTypeDto } from './dto/update-program-type.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('programTypes')
@Controller('program-types')
export class ProgramTypesController {
  constructor(private readonly programTypesService: ProgramTypesService) {}

  @Post()
  create(@Body() createProgramTypeDto: CreateProgramTypeDto) {
    return this.programTypesService.create(createProgramTypeDto);
  }

  @ApiOperation({ summary: 'Obtener todos los tipos de programas' })
  @ApiResponse({ status: 200, description: 'Lista de tipos de programas' })
  @Get()
  findAll() {
    return this.programTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.programTypesService.findOne(id); // <--- sin "+"
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProgramTypeDto: UpdateProgramTypeDto,
  ) {
    return this.programTypesService.update(id, updateProgramTypeDto); // <--- sin "+"
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.programTypesService.remove(id); // <--- sin "+"
  }
}
