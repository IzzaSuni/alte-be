import { Test, TestingModule } from '@nestjs/testing';
import { PraktikansController } from './praktikans.controller';

describe('PraktikansController', () => {
  let controller: PraktikansController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PraktikansController],
    }).compile();

    controller = module.get<PraktikansController>(PraktikansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
