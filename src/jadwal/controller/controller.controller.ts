import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { createJadwalDto } from '../dto/jadwal.Dto';
import { jadwalService } from '../service/service.service';

@Controller('jadwal')
export class ControllerController {
  constructor(private jadwalService: jadwalService) {}

  @Get()
  async getAllJadwal() {
    return this.jadwalService.getAllJadwal();
  }

  @Get('find')
  async findJadwalBy(@Param() param) {
    return this.jadwalService.findJadwalBy(param);
  }

  @Delete()
  async deleteJadwalBy(@Body() id: ObjectId) {
    return this.jadwalService.deleteJadwal(id);
  }

  @Post()
  async postJadwal(@Body() createJadwal: createJadwalDto) {
    return this.jadwalService.postJadwal(createJadwal);
  }

  @Put()
  async EditJadwal(@Body() createJadwal: createJadwalDto) {
    return this.jadwalService.postJadwal(createJadwal);
  }
}
