import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ControllerController } from './controller/controller.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { jadwalSchema } from './jadwal.model';
import { TokenCheck } from 'src/user/user.middleware';
import { jadwalService } from './service/service.service';
import { PraktikumSchema } from 'src/praktikum/praktikum.model';
import { locationSchema } from 'src/location/location.model';
import { groupSchema } from 'src/group/group.model';
import { peminjamanSchema } from 'src/peminjaman/peminjaman.model';
import { tableSchema } from 'src/table/table.model';
import { praktikumDetailSchema } from 'src/praktikum detail/module.model';
import { komponenDetailSchema } from 'src/komponen_detail/komponen.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'jadwal', schema: jadwalSchema }]),
    MongooseModule.forFeature([{ name: 'praktikum', schema: PraktikumSchema }]),
    MongooseModule.forFeature([
      { name: 'praktikum_detail', schema: praktikumDetailSchema },
    ]),
    MongooseModule.forFeature([{ name: 'location', schema: locationSchema }]),
    MongooseModule.forFeature([{ name: 'group', schema: groupSchema }]),
    MongooseModule.forFeature([{ name: 'table', schema: tableSchema }]),
    MongooseModule.forFeature([
      { name: 'peminjaman', schema: peminjamanSchema },
    ]),
    MongooseModule.forFeature([
      { name: 'tools', schema: komponenDetailSchema },
    ]),
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
