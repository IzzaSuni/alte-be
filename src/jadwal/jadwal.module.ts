import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ControllerController } from './controller/controller.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { jadwalSchema } from './jadwal.model';
import { TokenCheck } from 'src/user/user.middleware';
import { jadwalService } from './service/service.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'jadwal', schema: jadwalSchema }]),
  ],
  providers: [jadwalService],
  controllers: [ControllerController],
})
export class JadwalModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenCheck)
      .forRoutes({ path: 'jadwal', method: RequestMethod.ALL });
  }
}
