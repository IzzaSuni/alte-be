import { Test, TestingModule } from '@nestjs/testing';
import { komponenService } from './komponen.service';

describe('komponenService', () => {
  let service: komponenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [komponenService],
    }).compile();

    service = module.get<komponenService>(komponenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
