import { Test, TestingModule } from '@nestjs/testing';
import { SwapGroupService } from './swap-group.service';

describe('SwapGroupService', () => {
  let service: SwapGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SwapGroupService],
    }).compile();

    service = module.get<SwapGroupService>(SwapGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
