import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model, ObjectId } from 'mongoose';
import { sendRespObj } from 'src/utils/func';
import { jadwalCreateParam } from 'src/utils/types';
import { Jadwal } from '../jadwal.model';

@Injectable()
export class jadwalService {
  constructor(
    @InjectModel('jadwal') private readonly jadwalModel: Model<Jadwal>,
  ) {}

  async getAllJadwal() {
    return this.jadwalModel.find().exec();
  }

  async findJadwalBy(month) {
    const jadwals = await this.jadwalModel.find().exec();
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

  async postJadwal(payload: jadwalCreateParam) {
    const newJadwal = new this.jadwalModel({
      ...payload,
      created_at: new Date(),
      edited_at: null,
    });
    const res = await newJadwal.save();
    if (res) return sendRespObj(1, 'Berhasil membuat jadwal', newJadwal);
    else sendRespObj(0, 'Maaf terjadi kesalahan', {});
  }

  async editJadwal(payload: jadwalCreateParam) {
    return await this.jadwalModel.findByIdAndUpdate(
      payload.id,
      {
        ...payload,
        edited_at: new Date(),
      },
      (err, docs) => {
        if (err) return sendRespObj(0, 'Maaf terjadi kesalahan', {});
        return sendRespObj(1, 'Berhasil membuat jadwal', docs);
      },
    );
  }

  async deleteJadwal(id: ObjectId) {
    return await this.jadwalModel.findByIdAndDelete(id, (err, docs) => {
      if (err) return sendRespObj(0, 'Maaf terjadi kesalahan', err);
      return sendRespObj(1, 'Berhasil membuat jadwal', docs);
    });
  }
}
