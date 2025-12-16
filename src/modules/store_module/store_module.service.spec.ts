import { Test, TestingModule } from '@nestjs/testing';
import { StoreModuleService } from './store_module.service';

describe('StoreModuleService', () => {
  let service: StoreModuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoreModuleService],
    }).compile();

    service = module.get<StoreModuleService>(StoreModuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
