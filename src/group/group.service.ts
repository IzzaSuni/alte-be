import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { Praktikum } from 'src/praktikum/praktikum.model';
import { User } from 'src/user/user.model';
import { sendRespObj } from 'src/utils/func';
import { Group, GroupParam } from './group.model';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel('group') private readonly GROUP: Model<Group>,
    @InjectModel('praktikum') private readonly PRAKTIKUM: Model<Praktikum>,
    @InjectModel('user') private readonly USER: Model<User>,
  ) {}

  async GET() {
    return this.GROUP.find().exec();
  }

  async getEnrolledPraktikans() {
    const praktikans = await this.GET();
    const listPraktikans = [];
    praktikans?.forEach((praktikan) =>
      praktikan.user.forEach((users) => listPraktikans.push(users.id)),
    );
    return listPraktikans;
  }

  async POST(payload: GroupParam) {
    const group = await this.GROUP.findOne({ group: payload.group });
    if (group?.group === payload.group) {
      if (payload.praktikum === group?.praktikum)
        return sendRespObj(0, 'Maaf group praktikum tersebut tersedia');
    }
    const praktikans = await this.getEnrolledPraktikans();
    const doubledUser = [];
    payload.user.forEach((users) => {
      if (praktikans.includes(users.id)) doubledUser.push(users.fullname);
    });
    if (doubledUser.length > 0)
      return sendRespObj(
        0,
        'Beberapa mahasiswa sudah terdaftar di group lain',
        { data: doubledUser },
      );

    const newObj = new this.GROUP({
      ...payload,
      created_at: new Date(),
      edited_at: null,
    });

    const res = await newObj.save();
    if (res) return sendRespObj(1, 'Berhasil membuat grub praktikum', newObj);
    else sendRespObj(0, 'Maaf terjadi kesalahan', {});
  }

  async EDIT(payload: GroupParam, id: string) {
    const group = await this.GROUP.findOne({ group: payload.group });
    if (group?.group === payload.group) {
      if (payload.praktikum === group?.praktikum)
        return sendRespObj(0, 'Maaf group tersebut tersedia', {});
    }
    const praktikans = await this.getEnrolledPraktikans();
    const doubledUser = [];
    payload.user.forEach((users) => {
      if (praktikans.includes(users.id)) doubledUser.push(users.fullname);
    });
    if (doubledUser.length > 0)
      return sendRespObj(
        0,
        'Beberapa mahasiswa sudah terdaftar di group lain',
        { data: doubledUser },
      );

    const update = await this.GROUP.findByIdAndUpdate(id, {
      ...payload,
      edited_at: moment(),
    });
    if (update) return sendRespObj(1, 'Sukses mengedit group', update);
    return sendRespObj(0, 'Maaf terjadi kesalahan', {});
  }

  async enrollUserToGroup(userId: string, groupId: string) {
    const user = await this.USER.findById(userId);
    const group = await this.GROUP.findById(groupId);
    if (!user && !group) return sendRespObj(0, 'Maaf terjadi kesalahan');
    await group.user.push(user);
    return sendRespObj(0, 'Maaf terjadi kesalahan', {});
  }

  async DELETE(id: { id: string }) {
    const deleted = await this.GROUP.findByIdAndDelete(id?.id);
    if (deleted) return sendRespObj(1, 'Berhasil menghapus Praktikum', deleted);
    return sendRespObj(0, 'Maaf terjadi kesalahan', {});
  }
}
