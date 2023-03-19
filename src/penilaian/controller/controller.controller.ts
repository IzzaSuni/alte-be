import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { penilaianParam } from '../penilaian.model';
import { ServiceService } from '../service/service.service';

@Controller('controller')
export class ControllerController {
  constructor(private SERVICE: ServiceService) {}

  @Get()
  async getAllKomponen() {
    return await this.SERVICE.GET();
  }
  @Post()
  async postKomponen(@Body() penilaianDtos: penilaianParam) {
    return this.SERVICE.POST(penilaianDtos);
  }
  @Delete()
  async deleteKomponen(@Query('id') id: string) {
    return this.SERVICE.DELETE(id);
  }
  @Put()
  async editKomponen(@Query('id') id: string) {
    return this.SERVICE.EDIT(id);
  }
}
