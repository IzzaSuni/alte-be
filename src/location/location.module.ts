import { Module } from '@nestjs/common';
import { ServiceService } from './service/service.service';
import { ControllerController } from './controller/controller.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { locationSchema } from './location.model';

@Module({
  providers: [ServiceService],
  controllers: [ControllerController],
  imports: [
    MongooseModule.forFeature([{ name: 'Location', schema: locationSchema }]),
  ],
})
export class LocationModule {}
