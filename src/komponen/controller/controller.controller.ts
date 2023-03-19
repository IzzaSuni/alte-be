import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { KomponenDto } from '../komponen.model';
import { komponenService } from '../service/komponen.service';

@Controller('komponen')
export class ControllerController {
  constructor(private komponenServices: komponenService) {}

  @Get()
  async getAllKomponen() {
    return await this.komponenServices.getAllKomponen();
  }
  @Post()
  async postKomponen(@Body() komponenDto: KomponenDto) {
    return this.komponenServices.postKomponen(komponenDto);
  }
  @Delete()
  async deleteKomponen(@Body() id: string) {
    return this.komponenServices.deleteKomponen(id);
  }
  @Put()
  async editKomponen(
    @Query('id') id: string,
    @Body() komponenDto: KomponenDto,
  ) {
    return this.komponenServices.editKomponen(id, komponenDto);
  }
}
