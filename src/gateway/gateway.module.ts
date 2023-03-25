import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { absenSchema } from 'src/absen/absen.model';
import { controlSchema } from 'src/controls-state/controls-state.model';
import { groupSchema } from 'src/group/group.model';
import { jadwalSchema } from 'src/jadwal/jadwal.model';
import { userSchema } from 'src/user/user.model';
import { AlteGateway } from './gateway';

@Module({
  providers: [AlteGateway],
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: userSchema },
      { name: 'ControlState', schema: controlSchema },
      { name: 'Group', schema: groupSchema },
      { name: 'Jadwal', schema: jadwalSchema },
      { name: 'absen', schema: absenSchema },
    ]),
  ],
})
export class GatewayModule {}
