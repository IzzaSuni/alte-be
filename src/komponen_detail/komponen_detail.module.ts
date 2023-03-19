import { Module } from '@nestjs/common';

import { KomponenDetailController } from './komponen_detail.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { komponenDetailSchema } from './komponen.model';
import { komponenSchema } from 'src/komponen/komponen.model';

@Module({
  controllers: [KomponenDetailController],
  imports: [
    MongooseModule.forFeature([
      { name: 'komponen_detail', schema: komponenDetailSchema },
      { name: 'komponen', schema: komponenSchema },
    ]),
  ],
})
export class KomponenDetailModule {}
