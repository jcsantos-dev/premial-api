import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TicketItemService } from './ticket-item.service';
import { CreateTicketItemDto } from './dto/create-ticket-item.dto';
import { UpdateTicketItemDto } from './dto/update-ticket-item.dto';

@Controller('ticket-item')
export class TicketItemController {
  constructor(private readonly ticketItemService: TicketItemService) {}

  @Post()
  create(@Body() createTicketItemDto: CreateTicketItemDto) {
    return this.ticketItemService.create(createTicketItemDto);
  }

  @Get()
  findAll() {
    return this.ticketItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketItemService.findOne(+id);
  }

  @Get('ticket/:ticketId')
  findByStore(@Param('ticketId') id: string) {
    return this.ticketItemService.findByTicket(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTicketItemDto: UpdateTicketItemDto,
  ) {
    return this.ticketItemService.update(+id, updateTicketItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketItemService.remove(+id);
  }
}
