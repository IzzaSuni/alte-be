import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { penilaianDto } from '../penilaian.model';
import { ServiceService } from '../service/service.service';

@Controller('controller')
export class ControllerController {
  constructor(private SERVICE: ServiceService) {}

  @Get()
  async getAllKomponen() {
    return await this.SERVICE.GET();
  }
  @Post()
  async postKomponen(@Body() penilaianDto: penilaianDto) {
    return this.SERVICE.POST(penilaianDto);
  }
  @Delete()
  async deleteKomponen(@Body() id: string) {
    return this.SERVICE.DELETE(id);
  }
  @Put()
  async editKomponen(@Body() penilaianDto: penilaianDto) {
    return this.SERVICE.EDIT(penilaianDto);
  }
}
