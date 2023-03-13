import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Praktikum } from 'src/praktikum/praktikum.model';
import { sendRespObj } from 'src/utils/func';
import { buffer } from 'stream/consumers';
import { Module, ModuleFile, ModuleParam } from '../module.model';
const message = {
  praktikumNotFound:
    'Maaf Praktikum belum terdaftar, silahkan input praktikum terlebih dahulu',
  hasSameNamePraktikum: 'Maaf Praktikum tersebut sudah tersedia',
  wrongFileType: 'Tipe file harus berupa pdf',
  noFile: 'File harus diinput',
};

@Injectable()
export class ServiceService {
  constructor(
    @InjectModel('Module') private readonly Modul: Model<Module>,
    @InjectModel('ModuleFile') private readonly FILE: Model<ModuleFile>,
    @InjectModel('Praktikum') private readonly Praktikum: Model<Praktikum>,
  ) {}
  async GET() {
    return await this.Modul.find().exec();
  }

  async POST(
    file: { buffer: object; mimetype: string },
    payload: ModuleParam,
    praktikumId: string,
  ) {
    if (!file) return sendRespObj(10, message.noFile);

    const { mimetype } = file;
    const isWrongFileType = mimetype !== 'application/pdf';
    if (isWrongFileType) return sendRespObj(11, message.wrongFileType);

    const praktikum = await this.Praktikum.findById(praktikumId);
    if (!praktikum) return sendRespObj(12, message.praktikumNotFound);

    const fileObj = new this.FILE({
      file: file,
    });
    const moduleObj = new this.Modul({
      module_no: payload.module_no,
      module_name: payload.module_name,
      praktikum: praktikum,
      created_at: new Date(),
      edited_at: null,
      file_id: fileObj.id,
    });
    praktikum?.module.push(moduleObj);

    await moduleObj.save();
    await fileObj.save();
    const res = await praktikum.save();

    if (res) return sendRespObj(1, 'Berhasil menambah Modul', res);
    else sendRespObj(0, 'Maaf terjadi kesalahan', {});
  }

  async EDIT(file: object, payload: ModuleParam, moduleId: string) {
    const newObj = {
      ...payload,
      edited_at: new Date(),
    };
    const res = await this.Modul.findByIdAndUpdate(moduleId, newObj);
    if (res) return sendRespObj(1, 'Berhasil mengedit Modul', res);
    return sendRespObj(0, 'Maaf terjadi kesalahan', {});
  }

  async DELETE(moduleId: string) {
    const modul = await this.Modul.findByIdAndDelete(moduleId);
    if (!modul) {
      return sendRespObj(10, 'Maaf module tidak ditemukan');
    }
    const praktikumId = modul?.praktikum._id;
    const fileId = modul?.file_id;
    await this.Praktikum.findByIdAndUpdate(praktikumId, {
      $pull: { module: moduleId },
    });
    const res = await this.FILE.findByIdAndDelete(fileId);
    if (res) return sendRespObj(1, 'Sukses Menghapus Modul', res);
    return sendRespObj(0, 'Maaf terjadi kesalahan', {});
  }

  async Download(moduleId) {
    const module: any = await this.FILE.findById(moduleId);
    return sendRespObj(1, 'oke', module);
  }
}
