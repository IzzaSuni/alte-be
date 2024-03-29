import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { JadwalDTO } from '../jadwal.model';
import { jadwalService } from '../service/service.service';
import { userParam } from 'src/user/user.model';

@Controller('jadwal')
export class ControllerController {
  constructor(private jadwalServices: jadwalService) {}

  @Get()
  async getAllJadwal() {
    return this.jadwalServices.getAllJadwal();
  }

  @Get('find')
  async findJadwalBy(@Query('month') month: number) {
    return this.jadwalServices.findJadwalBy(month);
  }

  @Get('current')
  async findCurrentJadwal(@Query('userId') userId: userParam) {
    return this.jadwalServices.findCurrentJadwal(userId);
  }

  @Delete()
  async deleteJadwalBy(@Body() id: ObjectId) {
    return this.jadwalServices.deleteJadwal(id);
  }

  @Post()
  async postJadwal(@Body() createJadwal: JadwalDTO) {
    return this.jadwalServices.postJadwal(createJadwal);
  }

  @Put()
  async EditJadwal(@Body() createJadwal: JadwalDTO) {
    return this.jadwalServices.postJadwal(createJadwal);
  }
}
