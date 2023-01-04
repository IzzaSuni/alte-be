import { Test, TestingModule } from '@nestjs/testing';
import { jadwalService } from './service.service';

describe('ServiceService', () => {
  let service: jadwalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [jadwalService],
    }).compile();

    service = module.get<jadwalService>(jadwalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
