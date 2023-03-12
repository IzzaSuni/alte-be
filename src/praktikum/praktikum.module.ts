import { Module } from '@nestjs/common';
import { ServiceService } from './service/service.service';
import { ControllerController } from './controller/controller.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PraktikumSchema } from './praktikum.model';
import { moduleSchema } from 'src/module/module.model';

@Module({
  providers: [ServiceService],
  controllers: [ControllerController],
  imports: [
    MongooseModule.forFeature([
      { name: 'Praktikum', schema: PraktikumSchema },
      { name: 'Module', schema: moduleSchema },
    ]),
  ],
})
export class PraktikumModule {}
