import { Module } from '@nestjs/common';
import { SwapGroupController } from './swap-group.controller';
import { SwapGroupService } from './swap-group.service';

@Module({
  controllers: [SwapGroupController],
  providers: [SwapGroupService]
})
export class SwapGroupModule {}
