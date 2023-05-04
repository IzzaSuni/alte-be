import { Module } from '@nestjs/common';
import { ControllerController } from './controller/controller.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { locationSchema } from './location.model';
import { tableSchema } from 'src/table/table.model';

@Module({
  controllers: [ControllerController],
  imports: [
    MongooseModule.forFeature([{ name: 'Location', schema: locationSchema }]),
    MongooseModule.forFeature([{ name: 'table', schema: tableSchema }]),
  ],
})
export class LocationModule {}
