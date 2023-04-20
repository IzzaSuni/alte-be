import { Test, TestingModule } from '@nestjs/testing';
import { SwapGroupController } from './swap-group.controller';

describe('SwapGroupController', () => {
  let controller: SwapGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SwapGroupController],
    }).compile();

    controller = module.get<SwapGroupController>(SwapGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
