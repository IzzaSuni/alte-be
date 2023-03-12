import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { AbsenDto } from '../absen.model';
import { ServiceService } from '../service/service.service';

@Controller('absen')
export class ControllerController {
  constructor(private SERVICE: ServiceService) {}

  @Get()
  async getAllKomponen() {
    return await this.SERVICE.GET();
  }
  @Post()
  async postKomponen(
    @Body() PraktikumDto: AbsenDto,
    @Query('finger_id') id: string,
  ) {
    return this.SERVICE.POST(PraktikumDto, id);
  }
  @Put()
  async editKomponen(@Body() PraktikumDto: AbsenDto, @Query('id') id: string) {
    return this.SERVICE.EDIT(PraktikumDto, id);
  }
}
