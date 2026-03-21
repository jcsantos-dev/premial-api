import { Test, TestingModule } from '@nestjs/testing';
import { TicketService } from './ticket.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ticket } from '../../entities/Ticket';
import { TicketItem } from '../../entities/TicketItem';
import { UserLoyalty } from '../../entities/UserLoyalty';
import { StoreProduct } from '../../entities/StoreProduct';
import { UserLoyaltyLog } from '../../entities/UserLoyaltyLog';
import { UserCustomer } from '../../entities/UserCustomer';
import { LoyaltyActionType } from '../../entities/LoyaltyActionType';
import { Coupon } from '../../entities/Coupon';
import { RewardType } from '../../entities/RewardType';

describe('TicketService', () => {
  let service: TicketService;

  const mockRepo = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 1, ...dto })),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketService,
        { provide: getRepositoryToken(Ticket), useValue: mockRepo },
        { provide: getRepositoryToken(TicketItem), useValue: mockRepo },
        { provide: getRepositoryToken(UserLoyalty), useValue: mockRepo },
        { provide: getRepositoryToken(StoreProduct), useValue: mockRepo },
        { provide: getRepositoryToken(UserLoyaltyLog), useValue: mockRepo },
        { provide: getRepositoryToken(UserCustomer), useValue: mockRepo },
        { provide: getRepositoryToken(LoyaltyActionType), useValue: mockRepo },
        { provide: getRepositoryToken(Coupon), useValue: mockRepo },
        { provide: getRepositoryToken(RewardType), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<TicketService>(TicketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a ticket with a custom date', async () => {
    const customDate = '2026-03-20';
    const dto = {
      storeId: '1',
      total_amount: 100,
      items: [],
      generatedAt: customDate,
    };

    const result = await service.create(dto as any);
    expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining({
      generated_at: new Date(customDate),
    }));
  });

  it('should apply a discount when a coupon is provided', async () => {
    const couponUuid = 'coupon-123';
    const userId = 'user-456';
    const dto = {
      storeId: '1',
      total_amount: 500,
      qr_scanned_by_user_id: userId,
      couponUuid: couponUuid,
      items: [],
    };

    // Mock finding coupon
    mockRepo.findOne.mockImplementation((opt) => {
      if (opt.where.uuid === couponUuid) {
        return Promise.resolve({
          uuid: couponUuid,
          isActive: true,
          requiredAmount: '100', // $100 discount
          rewardType: { name: 'descuento' },
        });
      }
      if (opt.where.id === userId) {
        return Promise.resolve({ id: userId, user: { id: 'real-user-id' } });
      }
      return Promise.resolve(null);
    });

    const result = await service.create(dto as any);
    // expect total_amount to be 400 (500 - 100)
    expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining({
      total_amount: 400,
    }));
  });
});
