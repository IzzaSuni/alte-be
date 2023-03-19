import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { groupSchema } from 'src/group/group.model';
import { jadwalSchema } from 'src/jadwal/jadwal.model';
import { komponenDetailSchema } from 'src/komponen_detail/komponen.model';
import { userSchema } from 'src/user/user.model';
import { PeminjamanController } from './peminjaman.controller';
import { peminjamanSchema } from './peminjaman.model';

@Module({
  controllers: [PeminjamanController],
  imports: [
    MongooseModule.forFeature([
      { name: 'peminjaman', schema: peminjamanSchema },
      { name: 'komponen_detail', schema: komponenDetailSchema },
      { name: 'jadwal', schema: jadwalSchema },
      { name: 'group', schema: groupSchema },
      { name: 'user', schema: userSchema },
    ]),
  ],
})
export class PeminjamanModule {}
