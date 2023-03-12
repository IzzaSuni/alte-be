import { Module } from '@nestjs/common';
import { komponenService } from './service/komponen.service';
import { ControllerController } from './controller/controller.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { komponenSchema } from './komponen.model';

@Module({
  providers: [komponenService],
  controllers: [ControllerController],
  imports: [
    MongooseModule.forFeature([{ name: 'Komponen', schema: komponenSchema }]),
  ],
})
export class KomponenModule {}
