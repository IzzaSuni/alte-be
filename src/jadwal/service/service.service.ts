import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
}
