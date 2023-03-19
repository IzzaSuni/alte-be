import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { locationSchema } from 'src/location/location.model';
import { TableController } from './table.controller';
import { tableSchema } from './table.model';

@Module({
  controllers: [TableController],
  imports: [
    MongooseModule.forFeature([
      { name: 'location', schema: locationSchema },
      { name: 'table', schema: tableSchema },
    ]),
  ],
})
export class TableModule {}
