import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { controlSchema } from './controls-state.model';
import { ControlsStateController } from './controls-state.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ControlState', schema: controlSchema },
    ]),
  ],
  controllers: [ControlsStateController],
})
export class ControlsStateModule {}
