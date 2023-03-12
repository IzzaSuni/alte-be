import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { sendRespObj } from 'src/utils/func';
import { Penilaian, penilaianParam } from '../penilaian.model';

@Injectable()
export class ServiceService {
  constructor(
    @InjectModel('Penilaian') private readonly Models: Model<Penilaian>,
  ) {}
  async GET() {
    return this.Models.find().exec();
  }

  async POST(payload: penilaianParam) {
    const newObj = new this.Models({
      ...payload,
      created_at: new Date(),
      edited_at: null,
    });
    const res = await newObj.save();
    if (res) return sendRespObj(1, 'Berhasil menambah Praktikum', newObj);
    else sendRespObj(0, 'Maaf terjadi kesalahan', {});
  }

  async EDIT(payload: penilaianParam) {
    return await this.Models.findByIdAndUpdate(
      payload.id,
      {
        ...payload,
        edited_at: new Date(),
      },
      (err, docs) => {
        if (err) return sendRespObj(0, 'Maaf terjadi kesalahan', {});
        return sendRespObj(1, 'Berhasil mengedit Praktikum', docs);
      },
    );
  }

  async DELETE(id: string) {
    return await this.Models.findByIdAndDelete(id, (err, docs) => {
      if (err) return sendRespObj(0, 'Maaf terjadi kesalahan', err);
      return sendRespObj(1, 'Berhasil menghapus Praktikum', docs);
    });
  }
}
