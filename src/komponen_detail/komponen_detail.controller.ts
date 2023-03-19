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
    const newDetail = new this.DETAILL({
      amount: payload.amount,
      available_amount: payload.amount,
      value: payload.value,
      edited_log: null,
    });

    const res = await newDetail.save();
    if (res) return sendRespObj(1, 'Berhasil membuat komponen', newDetail);
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
    const find = await this.DETAILL.findById(id);

    if (find) {
      const editedLog = {
        value: find.value,
        amount: find.amount,
        available_amount: find.available_amount,
        edited_at: find.edited_at,
        user_id: find.edited_log.user_id,
        notes: find.edited_log.notes,
      };
      find.value = payload.value;
      find.available_amount = payload.available_amount;
      find.edited_log.before.push({ ...editedLog });
      find.edited_log.date = `${moment().format()}`;
      find.edited_log.notes = payload.notes;
      find.edited_log.user_id = payload.user_id;

      await find.save();
      return sendRespObj(1, 'komponen detail berhasil diedit', find);
    }

    return sendRespObj(0, 'Maaf komponen tersebut tidak ditemukan');
  }

  @Delete('del')
  async deleteKomponen(@Query('id') id: string) {
    const find = await this.DETAILL.findByIdAndDelete(id);
    if (find) return sendRespObj(1, 'Berhasil dihapus', find);
    return sendRespObj(0, 'Data tidak ditemukan');
  }
}
