import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { sendRespObj } from 'src/utils/func';
import { location, locationDTO } from '../location.model';

@Controller('lokasi')
export class ControllerController {
  constructor(
    @InjectModel('Location') private readonly LOCATION: Model<location>,
  ) {}

  @Get()
  async getAllLocation() {
    return await this.LOCATION.find().exec();
  }

  @Post()
  async createLocation(@Body() payload: locationDTO) {
    const location = await this.LOCATION.findOne({
      location_name: payload.location_name,
    });

    if (location)
      return sendRespObj(0, 'Lokasi tersebut sudah terdaftar', location);
    const registerLocation = new this.LOCATION({
      laboran: payload.laboran,
      location_name: payload.location_name,
    });
    await registerLocation.save();
    return sendRespObj(0, 'Lokasi berhasil terdaftar', registerLocation);
  }

  @Put()
  async editLocation(@Body() payload: locationDTO) {
    const location = await this.LOCATION.findById(payload.id);
    if (location) {
      // const findSameLocation=await this.LOCATION.find({})
      if (payload.location_name === location.location_name) {
        location.laboran = payload.laboran ?? location.laboran;
      } else {
        const findSameName = await this.LOCATION.findOne({
          location_name: payload.location_name,
        });
        if (findSameName)
          return sendRespObj(
            0,
            'Maaf nama lokasi tersebut sudah ada',
            findSameName,
          );

        location.location_name = payload.location_name;
        location.laboran = payload.laboran ?? location.laboran;
      }
      await location.save();
      return sendRespObj(1, 'List Laboran berhasil diedit', location);
    }
    return sendRespObj(0, 'Terjadi kesalahan');
  }

  @Delete()
  async deleteLocation(@Body() payload: locationDTO) {
    const location = await this.LOCATION.findById(payload.id);
    if (location) {
      await location.delete();
      return sendRespObj(1, 'Lokasi berhasil ditakeout', location);
    }
    return sendRespObj(0, 'Terjadi kesalahan');
  }
}
