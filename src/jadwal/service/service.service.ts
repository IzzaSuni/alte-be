import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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

  async findJadwalBy(param) {
    console.log(param);
    // const findJadwal = this.jadwalModel
    //   .find({ ...param }, (err, docs) => {
    //     if (err) return sendRespObj(0, 'Maaf terjadi kesalahan', {});
    //     if (!docs) return sendRespObj(1, 'Berhasil membuat jadwal', docs);
    //     return sendRespObj(1, 'Maaf jadwal tidak ditemukan', {});
    //   })
    //   .exec();

    // return await findJadwal;
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
