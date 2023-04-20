import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { praktikumDetail } from 'src/praktikum detail/module.model';
import { sendRespObj } from 'src/utils/func';
import { Praktikum, PraktikumParam } from '../praktikum.model';

@Injectable()
export class ServiceService {
  constructor(
    @InjectModel('Praktikum') private readonly PRAKTIKUM: Model<Praktikum>,
    @InjectModel('Module') private readonly DETAIL: Model<praktikumDetail>,
  ) {}
  async GET() {
    return this.PRAKTIKUM.find().populate('module').exec();
  }

  async POST(payload: PraktikumParam) {
    const findModule = await this.PRAKTIKUM.findOne({
      praktikum_name: payload.praktikum_name,
    });

    if (findModule)
      return sendRespObj(13, 'Maaf Praktikum tersebut sudah tersedia');

    const newObj = new this.PRAKTIKUM({
      ...payload,
      created_at: new Date(),
      edited_at: null,
    });
    const res = await newObj.save();
    if (res) return sendRespObj(1, 'Berhasil menambah Praktikum', newObj);
    else sendRespObj(0, 'Maaf terjadi kesalahan', {});
  }

  async EDIT(payload: any, id: string) {
    const res = await this.PRAKTIKUM.findByIdAndUpdate(id, {
      ...payload,
      edited_at: new Date(),
    });
    if (res) return sendRespObj(1, 'Berhasil mengedit Praktikum', res);
    return sendRespObj(0, 'Maaf terjadi kesalahan', {});
  }

  async DELETE(id: any) {
    const deleted = await this.PRAKTIKUM.findOneAndDelete(id);
    if (!deleted) return sendRespObj(0, 'Maaf terjadi kesalahan', {});
    await this.DETAIL.deleteMany({
      'praktikum.praktikum_name': deleted.praktikum_name,
    });
    return sendRespObj(1, 'Berhasil menghapus Praktikum', deleted);
  }
}
