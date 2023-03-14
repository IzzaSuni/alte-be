import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { sendRespObj } from 'src/utils/func';
import { Group, GroupParam } from './group.model';

@Injectable()
export class GroupService {
  constructor(@InjectModel('Group') private readonly Models: Model<Group>) {}

  async GET() {
    return this.Models.find().exec();
  }

  async POST(payload: GroupParam) {
    const newObj = new this.Models({
      ...payload,
      created_at: new Date(),
      edited_at: null,
    });
    const res = await newObj.save();
    if (res) return sendRespObj(1, 'Berhasil menambah Praktikum', newObj);
    else sendRespObj(0, 'Maaf terjadi kesalahan', {});
  }

  async EDIT(payload: GroupParam, id: string) {
    const { shift, group } = payload;
    const update = await this.Models.findByIdAndUpdate(id, {
      group,
      shift,
      edited_at: null,
    });
    if (update) return sendRespObj(1, 'Sukses mengedit group', update);
    return sendRespObj(0, 'Maaf terjadi kesalahan', {});
  }

  async DELETE(id: { id: string }) {
    const deleted = await this.Models.findByIdAndDelete(id?.id);
    if (deleted) return sendRespObj(1, 'Berhasil menghapus Praktikum', deleted);
    return sendRespObj(0, 'Maaf terjadi kesalahan', {});
  }
}
