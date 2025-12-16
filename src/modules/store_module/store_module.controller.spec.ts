import { Test, TestingModule } from '@nestjs/testing';
import { StoreModuleController } from './store_module.controller';
import { StoreModuleService } from './store_module.service';

describe('StoreModuleController', () => {
  let controller: StoreModuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreModuleController],
      providers: [StoreModuleService],
    }).compile();

    controller = module.get<StoreModuleController>(StoreModuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
