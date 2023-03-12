import { Module } from '@nestjs/common';
import { ServiceService } from './service/service.service';
import { ControllerController } from './controller/controller.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { fileSchema, moduleSchema } from './module.model';
import { PraktikumSchema } from 'src/praktikum/praktikum.model';

@Module({
  providers: [ServiceService],
  controllers: [ControllerController],
  imports: [
    MongooseModule.forFeature([
      { name: 'Module', schema: moduleSchema },
      { name: 'Praktikum', schema: PraktikumSchema },
      { name: 'ModuleFile', schema: fileSchema },
    ]),
  ],
})
export class ModuleModule {}
