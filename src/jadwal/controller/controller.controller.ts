import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { createJadwalDto } from '../dto/jadwal.Dto';
import { jadwalService } from '../service/service.service';

@Controller('jadwal')
export class ControllerController {
  constructor(private jadwalService: jadwalService) {}
  @Get()
  async getAllJadwal() {
    return this.jadwalService.getAllJadwal();
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
