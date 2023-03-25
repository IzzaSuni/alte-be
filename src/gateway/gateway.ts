import { OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { Absen } from 'src/absen/absen.model';
import { ControlState } from 'src/controls-state/controls-state.model';
import { Group } from 'src/group/group.model';
import { Jadwal } from 'src/jadwal/jadwal.model';
import { User } from 'src/user/user.model';

@WebSocketGateway({ cors: true })
export class AlteGateway implements OnModuleInit {
  constructor(
    @InjectModel('User') private readonly User: Model<User>,
    @InjectModel('ControlState') private readonly Control: Model<ControlState>,
    @InjectModel('Group') private readonly Group: Model<Group>,
    @InjectModel('Jadwal') private readonly Jadwal: Model<Jadwal>,
    @InjectModel('absen') private readonly Absen: Model<Absen>,
  ) {}

  @WebSocketServer()
  server: Server;
  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      socket.on('disconnect', (reason) => {
        console.log(reason, socket.id);
      });
    });
  }

  // ir or relay
  @SubscribeMessage('control')
  async onControlRelay(
    @MessageBody()
    body: {
      relay1: boolean;
      relay2: boolean;
      relay3: boolean;
      ac_controls: { object };
      ac_enroll: boolean;
      ac_index: number;
      ac_code: string;
    },
  ) {
    const isControlRelay = body.hasOwnProperty('relay1');
    const isAcControl = body.hasOwnProperty('ac_controls');
    const isEnrollAc = body?.ac_enroll === true;

    const ControlStates = await this.Control.findById(
      '63e4fcf891f3c8e32262f367',
    );

    const { ac_index, ac_code } = body;

    if (!isAcControl && !isControlRelay && !isEnrollAc) return;
    else if (isControlRelay) {
      const { relay1, relay2, relay3 } = body;
      const relayA = relay1 ? 'ON' : 'OFF';
      const relayB = relay2 ? 'ON' : 'OFF';
      const relayC = relay3 ? 'ON' : 'OFF';
      ControlStates.relay1 = relay1;
      ControlStates.relay2 = relay2;
      ControlStates.relay3 = relay3;
      await ControlStates.save();
      const paylod = `{\"relay1\":\"${relayA}\",\"relay2\":\"${relayB}\",\"relay3\":\"${relayC}\"}`;
      return this.server.emit(paylod);
    } else if (isAcControl && isEnrollAc) {
      const { ac_controls } = body;
      const obj = { ...ac_controls };
      ControlStates.ac_controls = obj;
      return await ControlStates.save();
    } else if (isAcControl && ac_index) {
      const { ac_state, ac_controls } = ControlStates;
      const selectedAc = ac_state[ac_index];
      const control_to_send = ac_controls?.[ac_code];
      const paylod = `{\"selected_ac\":\ ${selectedAc}\ ,\"ir_code\":\ "${control_to_send}\"}`;
      return this.server.emit(paylod);
    }
  }

  // finger id from arduino to web
  @SubscribeMessage('absen')
  async onEnroll(@MessageBody() body: { fingerId: string }) {
    let payload = '';
    const { fingerId } = body;
    const user = await this.User.findOne({ finger_id: Number(fingerId) });
    const { is_finger_registered } = user;
    if (is_finger_registered) {
      const currentDate: any = moment(new Date()).format('DD MMMM YYYY');
      const jadwals = await this.Jadwal.findOne({
        date: currentDate,
        'group.users.finger_id': fingerId,
      });
      if (jadwals) {
        const absen = await this.Absen.findOne({ jadwal_id: jadwals });
        if (absen) {
          payload = `{\"message\":\"Anda berhasil absen keluar\",\"status_door\":\ ${1} \"}`;
          absen.data.clock_out = `${moment().format()}`;
          await absen.save();
          return this.server.emit(payload);
        } else {
          payload = `{\"message\":\"Anda berhasil absen masuk\",\"status_door\":\ ${1} \"}`;
          const newAbsen = new this.Absen({
            data: { clock_in: `${moment().format()}`, user: user },
            jadwal_id: jadwals,
          });
          await newAbsen.save();
          return this.server.emit(payload);
        }
      }
      payload = `{\"message\":\"Anda tidak ada jadwal hari\",\"status_door\":\ ${1} \"}`;
      return this.server.emit(payload);
    }
    payload = `{\"message\":\"Maaf finger print tidak terdaftar"\,\"status_door\":\ ${0} \"}`;
    return this.server.emit(payload);
  }

  @SubscribeMessage('enroll')
  // finger id
  async onAbsen(@MessageBody() body: { fingerId: string; userId: string }) {
    const { fingerId, userId } = body;
    // from web to arduino
    if (userId) {
      const user = await this.User.findById(userId);
      const paylod = `{\"name\":\"${user.fullname}\",\"finger_id\":\ ${user.finger_id}\,\"angkatan\":\"${user.angkatan}\",\"role\":\"${user.role}\"},\"nim\":\"${user.nim}\"`;
      return this.server.emit(paylod);
    }
    // from arduino to web
    else if (fingerId) {
      const user = await this.User.findByIdAndUpdate(userId, {
        is_finger_registered: true,
      });
      if (user) return this.server.emit('sukses enroll finger');
    }
  }
}
