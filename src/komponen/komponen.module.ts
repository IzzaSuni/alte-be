import { Module } from '@nestjs/common';
import { komponenService } from './service/komponen.service';
import { ControllerController } from './controller/controller.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { komponenSchema } from './komponen.model';
import { komponenDetailSchema } from 'src/komponen_detail/komponen.model';

@Module({
  providers: [komponenService],
  controllers: [ControllerController],
  imports: [
    MongooseModule.forFeature([{ name: 'Komponen', schema: komponenSchema }]),
    MongooseModule.forFeature([
      { name: 'komponen_detail', schema: komponenDetailSchema },
    ]),
  ],
})
export class KomponenModule {}
