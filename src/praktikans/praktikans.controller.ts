import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { sendRespObj } from 'src/utils/func';
import { praktikan, praktikanParam } from './praktikans.model';

@Controller('praktikans')
export class PraktikansController {
  constructor(
    @InjectModel('praktikans') private readonly PRAKTIKANS: Model<praktikan>,
  ) {}
  @Get()
  async getAllPraktikans() {
    return await this.PRAKTIKANS.find().exec();
  }

  @Post()
  async importsPraktikan(@Body() payload: praktikanParam) {
    const praktikum = await this.PRAKTIKANS.findById(payload.praktikum_id);
    if (praktikum)
      return sendRespObj(
        0,
        'maaf data para praktikan dengan praktikum tersebut sudah ada',
        praktikum,
      );
    const newPraktikans = new this.PRAKTIKANS({
      data: payload.data,
      praktikum_id: payload.praktikum_id,
    });
    const res = await newPraktikans.save();
    if (res) return sendRespObj(1, 'sukses mengimport data praktikan', res);
    return sendRespObj(0, 'maaf terjadi kesalahan');
  }

  @Delete()
  async deletePraktikans(@Query('id') id: string) {
    const praktikans = await this.PRAKTIKANS.findByIdAndDelete(id);
    if (praktikans)
      return sendRespObj(1, 'data berhasil ditakeout', praktikans);
    return sendRespObj(0, 'Terjadi kesalahan');
  }
}
