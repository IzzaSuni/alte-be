import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import moment from 'moment';
import { Model } from 'mongoose';
import { Group } from 'src/group/group.model';
import { Jadwal } from 'src/jadwal/jadwal.model';
import { KomponenDetail } from 'src/komponen_detail/komponen.model';
import { User } from 'src/user/user.model';
import { sendRespObj } from 'src/utils/func';
import {
  approvingParam,
  Peminjaman,
  PeminjamanParam,
} from './peminjaman.model';

@Controller('peminjaman')
export class PeminjamanController {
  constructor(
    @InjectModel('peminjaman') private readonly Peminjaman: Model<Peminjaman>,
    @InjectModel('jadwal') private readonly Jadwal: Model<Jadwal>,
    @InjectModel('group') private readonly Group: Model<Group>,
    @InjectModel('user') private readonly User: Model<User>,
    @InjectModel('komponen_detail')
    private readonly KomponenDetail: Model<KomponenDetail>,
  ) {}
  @Get()
  async getAllPeminjaman() {
    return await this.Peminjaman.find().exec();
  }

  @Post()
  async createPeminjaman(@Body() payload: PeminjamanParam) {
    const jadwal = await this.Jadwal.findById(payload.jadwal_id);
    if (jadwal) {
      const group = await this.Group.findById(payload.group_id);
      const isValidGroup = jadwal.group.find(
        (groupItem) => groupItem.group === group.group,
      );
      if (isValidGroup) {
        const komponen = await this.KomponenDetail.findById(
          payload.komponen_detail_id,
        );
        const { available_amount } = komponen;
        if (available_amount) {
          const newPeminjaman = new this.Peminjaman({
            ...payload,
            aproved: {
              apsrak: null,
              laboran: null,
            },
          });
          newPeminjaman.save();
          return sendRespObj(
            1,
            'Request peminjaman berhasil dibuat',
            newPeminjaman,
          );
        }
      }
      return sendRespObj(
        0,
        'Maaf anda meminjam tidak pada group yang seharusnya',
      );
    }
    return sendRespObj(0, 'Jadwal belum ada');
  }

  @Put()
  async editPeminjaman(
    @Query('id') id: string,
    @Body() payload: PeminjamanParam,
  ) {
    const peminjaman = await this.Jadwal.findById(id);
    if (peminjaman) {
      const jadwal = await this.Jadwal.findById(payload.jadwal_id);
      if (jadwal) {
        const group = await this.Group.findById(payload.group_id);
        const isValidGroup = jadwal.group.find(
          (groupItem) => groupItem.group === group.group,
        );
        if (isValidGroup) {
          const komponen = await this.KomponenDetail.findById(
            payload.komponen_detail_id,
          );
          const { available_amount } = komponen;
          if (available_amount) {
            const newPeminjaman = new this.Peminjaman({
              ...payload,
              aproved: {
                apsrak: false,
                laboran: false,
              },
            });
            newPeminjaman.save();
            return sendRespObj(
              1,
              'Request peminjaman berhasil dibuat',
              newPeminjaman,
            );
          }
        }
        return sendRespObj(
          0,
          'Maaf anda meminjam tidak pada group yang seharusnya',
        );
      }
    }
    return sendRespObj(0, 'Jadwal belum ada');
  }

  @Put('aproving')
  async aprove(@Query('id') id: string, @Body() payload: approvingParam) {
    const peminjaman = await this.Peminjaman.findById(id);
    if (peminjaman) {
      const user = await this.User.findById(payload.user_id);
      const role = user.role;
      const { main, secondary } = role;
      if (payload.aprroved) {
        if (main === 'asprak' || secondary === 'asprak') {
          peminjaman.aproved.apsrak = payload.aprroved;
        } else {
          peminjaman.aproved.laboran = payload.aprroved;
        }
        peminjaman.approved_at = `${moment().format()}`;
        await peminjaman.save();
        return sendRespObj(1, 'berhasil mengapprove');
      }
    }
    return sendRespObj(0, 'Data peminjaman tidak ada');
  }
}
