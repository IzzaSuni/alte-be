import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { Komponen } from 'src/komponen/komponen.model';
import { sendRespObj } from 'src/utils/func';
import {
  editKomponenDetailParam,
  KomponenDetail,
  KomponenDetailParam,
} from './komponen.model';
moment.locale('id');

@Controller('komponen-detail')
export class KomponenDetailController {
  constructor(
    @InjectModel('komponen_detail')
    private readonly DETAILL: Model<KomponenDetail>,
    @InjectModel('komponen')
    private readonly Komponen: Model<Komponen>,
  ) {}

  @Get()
  async getAllKomponenDetail() {
    return await this.DETAILL.find().exec();
  }

  @Post()
  async createKomponenDetail(@Body() payload: KomponenDetailParam) {
    const find = await this.DETAILL.findOne({ value: payload.value });
    if (find)
      return sendRespObj(
        0,
        'Maaf komponen dengan nilai tersebut sudah terdaftar',
      );
    const komponen = await this.Komponen.findById(payload.komponen_id);
    if (komponen) {
      const newDetail = new this.DETAILL({
        amount: payload.amount,
        available_amount: payload.available_amount,
        value: payload.value,
        edited_log: null,
        komponen_id: payload.komponen_id,
      });
      komponen.komponen_detail.push(newDetail);
      await komponen.save();
      const res = await newDetail.save();
      if (res) return sendRespObj(1, 'Berhasil membuat komponen', newDetail);
    }

    return sendRespObj(0, 'Maaf terjadi kesalahan');
  }

  @Get('find')
  async findDetail(@Query('id') id: string) {
    const find = await this.Komponen.findById(id);
    if (find) {
      return sendRespObj(1, 'Data ditemukan', find);
    }
    return sendRespObj(0, 'Data tidak ditemukan');
  }

  @Put()
  async editKomponenDetail(
    @Query('id') id: string,
    @Body() payload: editKomponenDetailParam,
  ) {
    const komponens = await this.DETAILL.find({
      komponen_id: payload.komponen_id,
    });
    const find = komponens.find((komponen) => komponen.id === id);

    if (find) {
      const editedLog = {
        value: find.value,
        amount: find.amount,
        available_amount: find.available_amount,
        edited_at: find.edited_at,
        user_id: find.edited_log.user_id,
        notes: find.edited_log.notes,
      };

      const calculateAvalilable = () => {
        if (payload.amount > find.amount) {
          return payload.amount - find.amount;
        }
        return -(find.amount - payload.amount);
      };

      if (!payload.available_amount) {
        find.available_amount = find?.available_amount + calculateAvalilable();
      } else {
        find.available_amount = payload.available_amount;
      }
      find.edited_at = `${moment().format('')}`;
      find.value = payload.value;
      find.edited_log.before.push({ ...editedLog });
      find.edited_log.date = `${moment().format()}`;
      find.edited_log.notes = payload.notes;
      find.edited_log.user_id = payload.user_id;
      find.amount = payload.amount;

      let count = 0;
      komponens.forEach((komponen) => (count += komponen.amount));
      console.log(count);
      await this.Komponen.findByIdAndUpdate(payload.komponen_id, {
        total: count,
      });
      await find.save();
      return sendRespObj(1, 'komponen detail berhasil diedit', find);
    }

    return sendRespObj(0, 'Maaf komponen tersebut tidak ditemukan');
  }

  @Delete('del')
  async deleteKomponen(@Query('id') id: string) {
    const find = await this.DETAILL.findByIdAndDelete(id);
    if (find) {
      const praktikumId = find.komponen_id;
      const res = await this.Komponen.findByIdAndUpdate(
        praktikumId,
        {
          $pull: { komponen_detail: { _id: id } },
        },
        { new: true },
      ).exec();
      if (res) return sendRespObj(1, 'Berhasil dihapus', find);
    }
    return sendRespObj(0, 'Data tidak ditemukan');
  }
}
