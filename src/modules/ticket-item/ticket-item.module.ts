import { Module } from '@nestjs/common';
import { TicketItemService } from './ticket-item.service';
import { TicketItemController } from './ticket-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature(Object.values(entities))],
  controllers: [TicketItemController],
  providers: [TicketItemService],
})
export class TicketItemModule {}
