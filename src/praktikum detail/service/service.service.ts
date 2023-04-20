import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Praktikum } from 'src/praktikum/praktikum.model';
import { sendRespObj } from 'src/utils/func';
import {
  ModuleFile,
  praktikumDetailParam,
  praktikumDetail,
} from '../module.model';
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
    @InjectModel('praktikum_detail')
    private readonly DETAIL: Model<praktikumDetail>,
    @InjectModel('ModuleFile') private readonly FILE: Model<ModuleFile>,
    @InjectModel('Praktikum') private readonly Praktikum: Model<Praktikum>,
  ) {}
  async GET() {
    return await this.DETAIL.find().populate('praktikum').exec();
  }

  async findModulPraktikum(id) {
    const find = await this.Praktikum.findById(id).populate('module').exec();
    if (find) {
      return sendRespObj(1, 'berhasil mendapat data', find);
    }
    return sendRespObj(0, 'maaf tidak ditemukan data');
  }

  async POST(file, payload, praktikumId) {
    console.log(file);
    if (!file) return sendRespObj(0, message.noFile);

    const { mimetype } = file;
    const isWrongFileType = mimetype !== 'application/pdf';
    if (isWrongFileType) return sendRespObj(11, message.wrongFileType);

    const praktikum = await this.Praktikum.findById(praktikumId);
    if (!praktikum) return sendRespObj(12, message.praktikumNotFound);

    const fileObj = new this.FILE({
      file: file,
    });

    const moduleObj = new this.DETAIL({
      module_no: payload.module_no,
      module_name: payload.module_name,
      praktikum: praktikum,
      created_at: new Date(),
      edited_at: null,
      file_id: fileObj.id,
    });

    await moduleObj.save();
    await fileObj.save();

    return sendRespObj(1, 'Berhasil menambah Modul');
  }

  async EDIT(file: object, payload: praktikumDetailParam, moduleId: string) {
    const newObj = {
      ...payload,
      edited_at: new Date(),
    };
    const res = await this.DETAIL.findByIdAndUpdate(moduleId, newObj);
    if (res) return sendRespObj(1, 'Berhasil mengedit Modul', res);
    return sendRespObj(0, 'Maaf terjadi kesalahan', {});
  }

  async DELETE(moduleId: string) {
    const modul = await this.DETAIL.findByIdAndDelete(moduleId);
    if (!modul) {
      return sendRespObj(10, 'Maaf module tidak ditemukan');
    }
    const praktikumId = modul?.praktikum.id;
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
