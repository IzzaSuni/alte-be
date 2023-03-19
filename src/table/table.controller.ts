import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { location } from 'src/location/location.model';
import { sendRespObj } from 'src/utils/func';
import { table, tableDTO } from './table.model';

@Controller('table')
export class TableController {
  constructor(
    @InjectModel('table') private readonly TABLE: Model<table>,
    @InjectModel('location') private readonly LOCATION: Model<location>,
  ) {}
  @Get()
  async getAllTable() {
    return await this.TABLE.find().exec();
  }

  @Post()
  async createTable(@Body() payload: tableDTO) {
    const table = await this.TABLE.findOne({ table_id: payload.table_id });
    const location = await this.LOCATION.findById(payload.location);

    if (table) {
      if (location)
        return sendRespObj(0, 'Meja dengan id tersebut terdaftar', {
          ...table,
          ...location,
        });
    }

    if (location) {
      const newTable = new this.TABLE({ ...payload });
      await newTable.save();
      return sendRespObj(1, 'Meja terdaftarkan', { ...newTable, ...location });
    }

    return sendRespObj(0, 'Lokasi tidak terdaftar');
  }

  @Put()
  async editTable(@Body() payload: tableDTO) {
    const table = await this.TABLE.findById(payload.id);
    if (table) {
      const location = await this.LOCATION.findOne({
        location_name: payload.location,
      });
      if (location) return sendRespObj(0, 'Meja dengan id tersebut terdaftar');
      table.location = payload.location ?? table.location;
      table.table_id = payload.table_id ?? table.table_id;
      await table.save();
      return sendRespObj(1, 'Meja berhasil di edit');
    }
    return sendRespObj(0, 'Terjadi kesalahan');
  }

  @Delete()
  async deleteTable(@Body() payload: tableDTO) {
    console.log(payload);
    const table = await this.TABLE.findById(payload.id);
    if (table) {
      await table.delete();
      return sendRespObj(1, 'Meja berhasil di takeout');
    }
    return sendRespObj(0, 'Terjadi kesalahan');
  }
}
