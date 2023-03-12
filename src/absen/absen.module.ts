import { Module } from '@nestjs/common';
import { ServiceService } from './service/service.service';
import { ControllerController } from './controller/controller.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { absenSchema } from './absen.model';
import { userSchema } from 'src/user/user.model';

@Module({
  providers: [ServiceService],
  controllers: [ControllerController],
  imports: [
    MongooseModule.forFeature([
      { name: 'Absen', schema: absenSchema },
      { name: 'User', schema: userSchema },
    ]),
  ],
})
export class AbsenModule {}
