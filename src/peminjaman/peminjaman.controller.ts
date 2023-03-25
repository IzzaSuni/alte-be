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
  returnParam,
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
        const peminjamanKomponens = [];
        const unableToPinjam = [];
        payload.komponen.forEach(async (item) => {
          const komponen = await this.KomponenDetail.findById(
            item.komponen_detail_id.id,
          );
          const { available_amount } = komponen;
          if (available_amount) {
            return peminjamanKomponens.push(item);
          }
          return unableToPinjam.push(item);
        });
        if (unableToPinjam.length > 0) {
          return sendRespObj(
            0,
            'maaf terdapat barang yang tidak dapat dipinjam',
            unableToPinjam,
          );
        }
        const newPeminjaman = new this.Peminjaman({
          ...payload,
          komponen: peminjamanKomponens,
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
          const peminjamanKomponens = [];
          const unableToPinjam = [];
          payload.komponen.forEach(async (item) => {
            const komponen = await this.KomponenDetail.findById(
              item.komponen_detail_id.id,
            );
            const { available_amount } = komponen;
            if (available_amount) {
              return peminjamanKomponens.push(item);
            }
            return unableToPinjam.push(item);
          });
          if (unableToPinjam.length > 0) {
            return sendRespObj(
              0,
              'maaf terdapat barang yang tidak dapat dipinjam',
              unableToPinjam,
            );
          }
          const newPeminjaman = new this.Peminjaman({
            ...payload,
            komponen: peminjamanKomponens,
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
          peminjaman.approved_by.asprak = user;
        } else if (main === 'laboran') {
          peminjaman.aproved.laboran = payload.aprroved;
          peminjaman.approved_by.laboran = user;
        }
        peminjaman.approved_at = `${moment().format()}`;
        await peminjaman.save();
        return sendRespObj(1, 'berhasil mengapprove');
      }
      peminjaman.notes = payload.notes;
      await peminjaman.save();
      return sendRespObj(1, 'berhasil menolak', peminjaman);
    }
    return sendRespObj(0, 'Data peminjaman tidak ada');
  }

  @Put('return')
  async returning(@Query('id') id: string, @Body() payload: returnParam) {
    const peminjaman = await this.Peminjaman.findById(id);
    if (peminjaman) {
      const user = await this.User.findById(payload.user_id);
      const role = user.role;
      const { main, secondary } = role;
      if (payload.komponen) {
        peminjaman.return_condition = {
          ...payload,
        };
        await peminjaman.save();
        return sendRespObj(1, 'berhasil mengedit data', peminjaman);
      }
    }
    return sendRespObj(0, 'Data peminjaman tidak ada');
  }
}
