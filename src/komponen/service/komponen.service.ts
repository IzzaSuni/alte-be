import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { sendRespObj } from 'src/utils/func';
import { Komponen, KomponenParam } from '../komponen.model';

@Injectable()
export class komponenService {
  constructor(
    @InjectModel('Komponen') private readonly KomponenModel: Model<Komponen>,
  ) {}

  async getAllKomponen() {
    return this.KomponenModel.find().populate('komponen_detail').exec();
  }

  async postKomponen(payload: KomponenParam) {
    const newObj = new this.KomponenModel({
      ...payload,
    });
    newObj.edited_at = `${moment().format('')}`;
    const res = await newObj.save();
    if (res) return sendRespObj(1, 'Berhasil menambah komponen', newObj);
    else sendRespObj(0, 'Maaf terjadi kesalahan', {});
  }

  async editKomponen(id: string, payload: KomponenParam) {
    return await this.KomponenModel.findByIdAndUpdate(
      id,
      {
        ...payload,
        edited_log: `${moment().format('')}`,
      },
      (err, docs) => {
        if (err) return sendRespObj(0, 'Maaf terjadi kesalahan', {});
        return sendRespObj(1, 'Berhasil mengedit komponen', docs);
      },
    );
  }

  async deleteKomponen(id: string) {
    try {
      const res = await this.KomponenModel.findByIdAndDelete(id);
      if (res) return sendRespObj(1, 'Berhasil menghapus dokumen', res);
      return sendRespObj(0, 'maaf dokumen tidak ada');
    } catch (err) {
      return sendRespObj(0, 'Maaf terjadi kesalahan', err);
    }
  }
}
