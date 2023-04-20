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

@WebSocketGateway({ cors: true, pingTimeOut: 2000 })
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
    this.server.on('connection', async (socket: Socket) => {
      const ControlStates = await this.Control.findById(
        '63e4fcf891f3c8e32262f367',
      );
      if (
        socket.handshake.headers['user-agent'] === 'arduino-WebSocket-Client'
      ) {
        ControlStates.isOnline = true;
        ControlStates.onlineId = socket.id;
        await ControlStates.save();
        this.server.emit('onlineStatus', true);
      }
      socket.on('disconnect', async () => {
        if (socket.id === ControlStates.onlineId) {
          ControlStates.isOnline = false;
          ControlStates.onlineId = '';
          await ControlStates.save();
          this.server.emit('onlineStatus', false);
        }
      });
    });
  }

  // web
  @SubscribeMessage('controlRelay')
  async onControlRelayWeb(
    @MessageBody()
    body: {
      relay2: boolean;
      relay3: boolean;
    },
  ) {
    const ControlStates = await this.Control.findById(
      '63e4fcf891f3c8e32262f367',
    );

    console.log(body, ControlStates);
    const { relay2, relay3 } = body;

    const relayB = relay2 ? 'ON' : 'OFF';
    const relayC = relay3 ? 'ON' : 'OFF';

    ControlStates.relay2 = relay2;
    ControlStates.relay3 = relay3;
    await ControlStates.save();
    const paylod = `{\"relay2\":\"${relayB}\",\"relay3\":\"${relayC}\"}`;
    return this.server.emit(paylod);
  }

  @SubscribeMessage('relayControl')
  async onControlRelay(
    @MessageBody()
    body: {
      relay2: boolean;
      relay3: boolean;
    },
  ) {
    const ControlStates = await this.Control.findById(
      '63e4fcf891f3c8e32262f367',
    );

    const { relay2, relay3 } = body[0];

    const relayB = relay2 === 'ON' ? true : false;
    const relayC = relay3 === 'ON' ? true : false;

    ControlStates.relay2 = relayB;
    ControlStates.relay3 = relayC;
    await ControlStates.save();
  }

  //arduino auto off ac dan lampu
  @SubscribeMessage('jadwalCheck')
  async checkJadwal() {
    const currentDate: any = moment(new Date()).format('DD MMMM YYYY');
    const jadwals = await this.Jadwal.find({
      date: currentDate,
    }).populate('group');

    let foundJadwal = null;
    let payload = '';
    jadwals?.map((jadwal) => {
      const startHour = moment(jadwal.start_at);
      const endHour = moment(jadwal.end_at);
      const currentHour = moment(new Date());
      const isBetween = currentHour.isBetween(startHour, endHour);

      console.log(currentHour, startHour, endHour);
      if (isBetween) {
        foundJadwal = jadwal;
      }
    });

    const ControlStates = await this.Control.findById(
      '63e4fcf891f3c8e32262f367',
    );

    if (!foundJadwal) {
      ControlStates.relay2 = false;
      ControlStates.relay3 = false;
      ControlStates.ac_state[1].isOn = false;
      ControlStates.ac_state[2].isOn = false;
      await ControlStates.save();
      await this.server.emit('allControl', true);
      payload = `{\"allControlOff\":\"true\"}`;
    } else {
      payload = `{\"allControlOff\":\"false\"}`;
    }
    return this.server.emit(payload);
  }

  // web
  @SubscribeMessage('doorMonitor')
  async doorMonitor() {
    const ControlStates = await this.Control.findById(
      '63e4fcf891f3c8e32262f367',
    );

    return this.server.emit('door', ControlStates.relay1);
  }
  // arduino
  @SubscribeMessage('updateDoor')
  async doorUpdate(
    @MessageBody()
    body: {
      doorStatus: string;
    },
  ) {
    const ControlStates = await this.Control.findById(
      '63e4fcf891f3c8e32262f367',
    );
    const status = body.doorStatus === 'open' ? true : false;
    ControlStates.relay1 = status;
    await ControlStates.save();
    return this.server.emit('door', status);
  }

  // web
  @SubscribeMessage('acControl')
  async onAcControl(
    @MessageBody()
    body: {
      temperature: number;
      isOn: boolean;
      acIndex: number;
      monitor: number;
    },
  ) {
    console.log(body);
    const { temperature, isOn, acIndex, monitor } = body;
    const ControlStates = await this.Control.findById(
      '63e4fcf891f3c8e32262f367',
    );
    const index = Number(acIndex) as keyof typeof ControlStates.ac_state;

    if (monitor) {
      return this.server.emit('acState', ControlStates);
    }

    ControlStates.ac_state[index].isOn = isOn;
    ControlStates.ac_state[index].temperature = Number(temperature);

    await ControlStates.save();

    const payload = `{\"indexAc\":\"${acIndex}\" ,\"isOnAc\":\"${isOn}\",\"temperatureAc\":\"${temperature}\"}`;
    this.server.emit('acState', ControlStates);
    return this.server.emit(payload);
  }

  // arduino
  @SubscribeMessage('absen')
  async onEnroll(@MessageBody() body: { fingerId: string }) {
    const { fingerId } = body[0];
    let payload = '';
    let foundJadwal = null;
    const user = await this.User.findOne({ finger_id: Number(fingerId) });

    if (!user) {
      payload = `{\"message\":\"Anda berhasil absen keluar\",\"status_door\":\ ${1} \"}`;
    } else {
      const { is_finger_registered: isRegistered } = user;

      if (isRegistered) {
        const currentDate: any = moment(new Date()).format('DD MMMM YYYY');
        const jadwals = await this.Jadwal.find({
          date: currentDate,
        }).populate('group');

        let foundUser = null;
        jadwals?.map((jadwal) => {
          const startHour = moment(jadwal.start_at);
          const endHour = moment(jadwal.end_at);
          const currentHour = moment(new Date());
          const isBetween = currentHour.isBetween(startHour, endHour);

          if (isBetween) {
            foundJadwal = jadwal;
            jadwal.group.find((groupData) => {
              console.log(groupData);
              foundUser = groupData.users.find(async (user) => {
                const qUser = await this.User.findById(user);
                return qUser.finger_id === Number(fingerId);
              });
            });
          }
        });

        if (foundUser) {
          const absen = await this.Absen.findOne({ 'data.user': user });

          payload = `{\"message\":\"Anda berhasil absen masuk\",\"status_door\":\ ${1} \",\"user\":\" ${
            user.fullname
          } \"}`;

          if (!absen) {
            const newAbsen = new this.Absen({
              data: { clock_in: `${moment().format()}`, user: user },
              jadwal_id: foundJadwal,
            });
            await newAbsen.save();
          }

          return this.server.emit(payload);
        }
        payload = `{\"message\":\"Anda tidak ada jadwal hari ini\",\"status_door\":\ ${1} \",\"user\":\" ${
          user.fullname
        } \"}`;
        return this.server.emit(payload);
      }
    }
    payload = `{\"message\":\"Maaf finger print tidak terdaftar"\,\"status_door\":\ ${0} \"}`;
    return this.server.emit(payload);
  }

  // ardiono
  @SubscribeMessage('enroll')
  // finger id
  async onAbsen(@MessageBody() body: { fingerId: string; userId: string }) {
    const { fingerId } = body?.[0];

    // from arduino to web
    if (fingerId) {
      const user = await this.User.findOne({ finger_id: fingerId });
      if (user.is_finger_registered === true) {
        return this.server.emit(
          'status',
          `${
            user.fullname.split(' ')[0]
          } sidik jari anda telah terdaftar, kontak developer jika ingin mereset`,
        );
      }
      if (user) {
        user.is_finger_registered = true;
        await user.save();
        return this.server.emit('message', { message: 'Sukses enroll finger' });
      }
      return this.server.emit('message', {
        message: 'Maaf user tidak terdaftar',
      });
    }
    return this.server.emit('message', 'maaf terjadi kesalahan');
  }

  // web
  @SubscribeMessage('triggerEnroll')
  // finger id
  async onTriggerEnroll(@MessageBody() body: { userId: string }) {
    console.log(body);

    const { userId } = body;
    // from web to arduino
    if (userId) {
      const user = await this.User.findById(userId);
      if (user.retry_finger === 0) {
        return this.server.emit(
          'status',
          `${
            user.fullname.split(' ')[0]
          } telah melewati batas daftar jari, kontak developer jika ingin mereset`,
        );
      }
      const paylod = `{\"name\":\"${user.fullname}\",\"finger_id\":\ ${user.finger_id}\,\"angkatan\":\"${user.angkatan}\",\"role\":\"${user.role.main}\",\"nim\":\"${user.nim}\"}`;
      user.retry_finger -= 1;
      await user.save();
      return this.server.emit(paylod);
    }

    return this.server.emit('message', 'maaf terjadi kesalahan');
  }
}
