import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { sendRespObj } from 'src/utils/func';
import { Komponen, KomponenParam } from '../komponen.model';

@Injectable()
export class komponenService {
  constructor(
    @InjectModel('Komponen') private readonly KomponenModel: Model<Komponen>,
  ) {}

  async getAllKomponen() {
    return this.KomponenModel.find().exec();
  }

  async postKomponen(payload: KomponenParam) {
    const newObj = new this.KomponenModel({
      ...payload,
      created_at: new Date(),
      edited_at: null,
    });
    const res = await newObj.save();
    if (res) return sendRespObj(1, 'Berhasil menambah komponen', newObj);
    else sendRespObj(0, 'Maaf terjadi kesalahan', {});
  }

  async editKomponen(payload: KomponenParam) {
    return await this.KomponenModel.findByIdAndUpdate(
      payload.id,
      {
        ...payload,
        edited_at: new Date(),
      },
      (err, docs) => {
        if (err) return sendRespObj(0, 'Maaf terjadi kesalahan', {});
        return sendRespObj(1, 'Berhasil mengedit komponen', docs);
      },
    );
  }

  async deleteKomponen(id: string) {
    return await this.KomponenModel.findByIdAndDelete(id, (err, docs) => {
      if (err) return sendRespObj(0, 'Maaf terjadi kesalahan', err);
      return sendRespObj(1, 'Berhasil menghapus dokumen', docs);
    });
  }
}