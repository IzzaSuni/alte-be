import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JadwalModule } from './jadwal/jadwal.module';
import { KomponenModule } from './komponen/komponen.module';
import { PenilaianModule } from './penilaian/penilaian.module';
import { praktikumDetail } from './praktikum detail/module.module';
import { GroupModule } from './group/group.module';
import { PraktikumModule } from './praktikum/praktikum.module';
import { LocationModule } from './location/location.module';
import { AbsenModule } from './absen/absen.module';
import { EvaluasiModule } from './evaluasi/evaluasi.module';
import { GatewayModule } from './gateway/gateway.module';
import { ControlsStateModule } from './controls-state/controls-state.module';
import { TableModule } from './table/table.module';
import { KomponenDetailModule } from './komponen_detail/komponen_detail.module';
import { PraktikansModule } from './praktikans/praktikans.module';
import { PeminjamanModule } from './peminjaman/peminjaman.module';
import { SwapGroupModule } from './swap-group/swap-group.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://soxiSpeed:Sunariadi180901!@alte.uypme2k.mongodb.net/ALTE?retryWrites=true&w=majority',
    ),
    UserModule,
    JadwalModule,
    KomponenModule,
    PenilaianModule,
    praktikumDetail,
    GroupModule,
    PraktikumModule,
    LocationModule,
    AbsenModule,
    EvaluasiModule,
    GatewayModule,
    ControlsStateModule,
    TableModule,
    KomponenDetailModule,
    PraktikansModule,
    PeminjamanModule,
    SwapGroupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
