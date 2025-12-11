import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature(Object.values(entities))],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
