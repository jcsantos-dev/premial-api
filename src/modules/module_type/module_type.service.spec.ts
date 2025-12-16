import { Test, TestingModule } from '@nestjs/testing';
import { ModuleTypeService } from './module_type.service';

describe('ModuleTypeService', () => {
  let service: ModuleTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModuleTypeService],
    }).compile();

    service = module.get<ModuleTypeService>(ModuleTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
