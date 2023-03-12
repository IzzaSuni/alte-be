import { Test, TestingModule } from '@nestjs/testing';
import { ControlsStateController } from './controls-state.controller';

describe('ControlsStateController', () => {
  let controller: ControlsStateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ControlsStateController],
    }).compile();

    controller = module.get<ControlsStateController>(ControlsStateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
