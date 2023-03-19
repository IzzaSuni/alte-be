import { Test, TestingModule } from '@nestjs/testing';
import { KomponenDetailController } from './komponen_detail.controller';

describe('KomponenDetailController', () => {
  let controller: KomponenDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KomponenDetailController],
    }).compile();

    controller = module.get<KomponenDetailController>(KomponenDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
