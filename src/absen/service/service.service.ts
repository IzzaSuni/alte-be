import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.model';
import { sendRespObj } from 'src/utils/func';
import { Absen, AbsenParam } from '../absen.model';

@Injectable()
export class ServiceService {
  constructor(
    @InjectModel('Absen') private readonly Models: Model<Absen>,
    @InjectModel('User') private readonly UserModel: Model<User>,
  ) {}
  async GET() {
    return this.Models.find().exec();
  }

  async POST(payload: AbsenParam, id: string) {
    const find = await this.UserModel.findOne({ finger_id: id });
    const newObj = new this.Models({
      user: find,
      ...payload,
    });
    // const res = await newObj.save();
    // if (res) return sendRespObj(1, 'Berhasil Absen', newObj);
    // else sendRespObj(0, 'Maaf terjadi kesalahan', {});
  }

  async EDIT(payload: any, id: string) {
    return await this.Models.findByIdAndUpdate(
      id,
      {
        ...payload,
      },
      (err, docs) => {
        if (err) return sendRespObj(0, 'Maaf terjadi kesalahan', {});
        return sendRespObj(1, 'Berhasil mengedit Praktikum', docs);
      },
    ).clone();
  }
}
