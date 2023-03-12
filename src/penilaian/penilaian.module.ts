import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Mongoose } from 'mongoose';
import { ControllerController } from './controller/controller.controller';
import { penilaianSchema } from './penilaian.model';
import { ServiceService } from './service/service.service';

@Module({
  controllers: [ControllerController],
  providers: [ServiceService],
  imports:[MongooseModule.forFeature([{name:'Penilaian',schema:penilaianSchema}])]
})
export class PenilaianModule {}
