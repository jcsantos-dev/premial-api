import { Test, TestingModule } from '@nestjs/testing';
import { TicketItemController } from './ticket-item.controller';
import { TicketItemService } from './ticket-item.service';

describe('TicketItemController', () => {
  let controller: TicketItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketItemController],
      providers: [TicketItemService],
    }).compile();

    controller = module.get<TicketItemController>(TicketItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
