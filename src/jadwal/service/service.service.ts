import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import * as moment from 'moment';
import { Model, ObjectId } from 'mongoose';
import { sendRespObj } from 'src/utils/func';
import { Jadwal, JadwalParams } from '../jadwal.model';
import { Group } from 'src/group/group.model';
import { location } from 'src/location/location.model';
import { table } from 'src/table/table.model';
import { praktikumDetail } from 'src/praktikum detail/module.model';

@Injectable()
export class jadwalService {
  constructor(
    @InjectModel('jadwal') private readonly JADWAL: Model<Jadwal>,
    @InjectModel('group') private readonly GROUP: Model<Group>,
    @InjectModel('location') private readonly LOCATION: Model<location>,
    @InjectModel('praktikum_detail')
    private readonly PRAKTIKUMDETAIL: Model<praktikumDetail>,
    @InjectModel('table') private readonly TABLE: Model<table>,
  ) {}

  async getAllJadwal() {
    return this.JADWAL.find().exec();
  }

  async findJadwalBy(month) {
    const jadwals = await this.JADWAL.find()
      .populate({ path: 'praktikum_detail', populate: { path: 'praktikum' } })
      .populate('location')
      .populate('group')
      .exec();
    const find = jadwals.filter((jadwal: any) => {
      const monthNumber = new Date(jadwal.date).getMonth();
      return Number(monthNumber) === Number(month);
    });
    const holidays: any = await axios.get(
      'https://www.googleapis.com/calendar/v3/calendars/en.indonesian%23holiday%40group.v.calendar.google.com/events?key=AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs',
    );

    const findHoliday: any = holidays?.data?.items?.filter(
      (holiday) =>
        new Date(holiday.start.date).getMonth() === Number(month) &&
        new Date(holiday.start.date).getFullYear() === new Date().getFullYear(),
    );

    return [...find, ...findHoliday];
  }

  async findCurrentJadwal(userId) {
    const group = await this.GROUP.findOne({ users: userId });
    if (group) {
      const jadwal = await this.JADWAL.findOne({ group: group })
        .populate({
          path: 'praktikum_detail',
          populate: { path: 'praktikum' },
        })
        .populate('location');

      const currentDate = new Date();
      const comparator = moment(currentDate);
      const startTime = moment(jadwal?.start_at);
      const endTime = moment(jadwal?.end_at);

      if (jadwal && comparator.isBetween(startTime, endTime)) {
        return sendRespObj(1, 'Anda memiliki jadwal sekarang', jadwal);
      }
    }
    return sendRespObj(0, 'Maaf anda tidak ada jadwal sekarang');
  }

  async postJadwal(payload: JadwalParams) {
    const {
      end_at,
      start_at,
      location: locationId,
      group: groupId,
      table: tableId,
      date,
    } = payload;

    const jadwal = await this.JADWAL.findOne({ date: date })
      .populate('table')
      .populate('location');

    const duration = moment.duration(moment(end_at).diff(moment(start_at)));
    const hours = duration.asHours();

    const group = await this.GROUP.find({ _id: { $in: groupId } });
    const location = await this.LOCATION.findById(locationId);
    const table = await this.TABLE.findById(tableId);

    if (hours > 8) return sendRespObj(0, 'Maksimal 8 Jam');

    if (jadwal?.date === date) {
      if (locationId === jadwal?.location.id.toString()) {
        const comparator = moment(start_at);
        const comparator2 = moment(end_at);
        const comparator3 = moment(jadwal.start_at);

        const startGate = moment(jadwal?.start_at).format('');
        const endGate = moment(jadwal?.end_at).format('');
        const wantedStartGate = moment(start_at).format('');
        const wantedEndGate = moment(end_at).format('');

        if (
          comparator.isBetween(startGate, endGate) ||
          comparator2.isBetween(startGate, endGate) ||
          comparator3.isBetween(wantedStartGate, wantedEndGate)
        ) {
          return sendRespObj(0, 'Maaf waktu dan tempat sudah terisi');
        }
      }
    }

    const newJadwal = new this.JADWAL({
      ...payload,
      group: group,
      location: location,
      table: table,
      aproved: false,
      created_at: new Date(),
      edited_at: null,
    });

    const res = await newJadwal.save();
    if (res) return sendRespObj(1, 'Berhasil membuat jadwal', newJadwal);
    else sendRespObj(0, 'Maaf terjadi kesalahan', {});
  }

  // async editJadwal(payload: JadwalParams) {
  //   const jadwal = await this.JADWAL.findOne({ date: payload.date });

  //   if (jadwal.date === payload.date) {
  //     if (payload.location === jadwal.location) {
  //       if (payload.table === jadwal.table) {
  //         const comparator = moment(payload.start_at);
  //         const startGate = moment(jadwal.start_at);
  //         const endGate = moment(jadwal.end_at);
  //         if (comparator.isBetween(startGate, endGate)) {
  //           return sendRespObj(0, 'Maaf waktu dan tempat sudah terisi');
  //         }
  //       }
  //     }
  //   }

  //   const handleUpdate = (err, docs) => {
  //     if (err) return sendRespObj(0, 'Maaf terjadi kesalahan', {});
  //     return sendRespObj(1, 'Berhasil mengedit jadwal', docs);
  //   };

  //   const newJadwalObject = {
  //     ...payload,
  //     edited_at: new Date(),
  //   };

  //   return await this.JADWAL.findByIdAndUpdate(
  //     payload.id,
  //     newJadwalObject,
  //     handleUpdate,
  //   );
  // }

  async deleteJadwal(id: ObjectId) {
    return await this.JADWAL.findByIdAndDelete(id, (err, docs) => {
      if (err) return sendRespObj(0, 'Maaf terjadi kesalahan', err);
      return sendRespObj(1, 'Jadwal berhasil dihapus', docs);
    });
  }
}
