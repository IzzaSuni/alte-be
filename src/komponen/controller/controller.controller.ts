import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { KomponenDto } from '../komponen.model';
import { komponenService } from '../service/komponen.service';

@Controller('controller')
export class ControllerController {
  constructor(private komponenService: komponenService) {}

  @Get()
  async getAllKomponen() {
    return await this.komponenService.getAllKomponen();
  }
  @Post()
  async postKomponen(@Body() komponenDto: KomponenDto) {
    return this.komponenService.postKomponen(komponenDto);
  }
  @Delete()
  async deleteKomponen(@Body() id: string) {
    return this.komponenService.deleteKomponen(id);
  }
  @Put()
  async editKomponen(@Body() komponenDto: KomponenDto) {
    return this.komponenService.editKomponen(komponenDto);
  }
}
