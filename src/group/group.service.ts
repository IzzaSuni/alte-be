import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Praktikum } from 'src/praktikum/praktikum.model';
import { User } from 'src/user/user.model';
import { sendRespObj } from 'src/utils/func';
import { EditGroupParam, Group, GroupParam } from './group.model';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel('group') private readonly GROUP: Model<Group>,
    @InjectModel('praktikum') private readonly PRAKTIKUM: Model<Praktikum>,
    @InjectModel('users') private readonly USER: Model<User>,
  ) {}

  async GET() {
    return this.GROUP.find().exec();
  }

  async POST(payload: GroupParam) {
    const {
      praktikum: praktikumId,
      group: groupName,
      users: userList,
    } = payload;

    let praktikum, users;
    try {
      praktikum = await this.PRAKTIKUM.findById(praktikumId);
      users = await this.USER.find({ _id: { $in: userList } });
    } catch (err) {
      if (err.message.includes('praktikum')) {
        return sendRespObj(0, 'praktikum tersebut tidak ada');
      } else {
        return sendRespObj(
          0,
          `maaf user tidak terdaftar pada pilihan ke ${
            userList.indexOf(err.value) + 1
          }`,
        );
      }
    }

    const cekGroupExist = await this.GROUP.findOne({
      group: groupName,
      praktikum: praktikum,
    });

    if (cekGroupExist)
      return sendRespObj(0, 'Maaf group praktikum tersebut tersedia');

    const cekSameGroup = await this.GROUP.find({
      praktikum: praktikum,
      users: { $in: users },
    }).populate('users');

    const sameUserOnOtherGroupSamePraktikan = [];
    cekSameGroup.map(async (group) => {
      const filtered = group.users.filter((user) =>
        users.map((e) => e.id).includes(user.id),
      );
      return filtered?.map((filteredUser) =>
        sameUserOnOtherGroupSamePraktikan.push({
          name: filteredUser.fullname,
          group: group.group,
        }),
      );
    });

    if (sameUserOnOtherGroupSamePraktikan.length > 0) {
      return sendRespObj(
        0,
        'Maaf terdapat user yang sudah ter enroll di group lain dengan praktikum yang sama',
        { data: sameUserOnOtherGroupSamePraktikan },
      );
    }

    const newObj = new this.GROUP({
      ...payload,
      users: users,
      praktikum: praktikum,
      created_at: new Date(),
      edited_at: null,
    });

    const res = await newObj.save();
    if (res) return sendRespObj(1, 'Berhasil membuat grub praktikum', newObj);
    else sendRespObj(0, 'Maaf terjadi kesalahan', {});
  }

  async EDIT(payload: EditGroupParam) {
    const { groupIdX, groupIdY, praktikumId, userIdX, userIdY } = payload;

    try {
      const groupX = await this.GROUP.findOne({
        _id: groupIdX,
        users: userIdX,
      }).populate('praktikum');
      const groupY = await this.GROUP.findOne({
        _id: groupIdY,
        users: userIdY,
      }).populate('praktikum');
      const praktikum = await this.PRAKTIKUM.findById(praktikumId);

      if (groupX && groupY && praktikum.id === groupX.praktikum.id) {
        return sendRespObj(1, 'oke');
      } else {
        return sendRespObj(
          0,
          'maaf korelasi antara group dan praktikum tidak valid',
        );
      }
    } catch (err) {
      return sendRespObj(0, 'Maaf terjadi kesalahan', err);
    }

    // if (groupX.praktikum === groupY.praktikum) {
    //   if (praktikum.id === groupX.praktikum) {
    //     // do swap here
    //   }
    //   return sendRespObj(0, 'Maaf Praktikum yang direquest tidak sama');
    // } else {
    //   return sendRespObj(0, 'Maaf pertukaran harus di praktikum yang sama');
    // }
  }

  async enrollUserToGroup(userId: string, groupId: string) {
    const user = await this.USER.findById(userId);
    const group = await this.GROUP.findById(groupId);
    if (!user && !group) return sendRespObj(0, 'Maaf terjadi kesalahan');
    await group.users.push(user);
    return sendRespObj(0, 'Maaf terjadi kesalahan', {});
  }

  async DELETE(id: { id: string }) {
    const deleted = await this.GROUP.findByIdAndDelete(id?.id);
    if (deleted) return sendRespObj(1, 'Berhasil menghapus Praktikum', deleted);
    return sendRespObj(0, 'Maaf terjadi kesalahan', {});
  }
}
