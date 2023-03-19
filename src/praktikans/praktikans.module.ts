import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PraktikansController } from './praktikans.controller';
import { praktikansSchema } from './praktikans.model';

@Module({
  controllers: [PraktikansController],
  imports: [
    MongooseModule.forFeature([
      { name: 'praktikans', schema: praktikansSchema },
    ]),
  ],
})
export class PraktikansModule {}
