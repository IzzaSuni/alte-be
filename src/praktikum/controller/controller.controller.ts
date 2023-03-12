import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PraktikumDto } from '../praktikum.model';
import { ServiceService } from '../service/service.service';

@Controller('praktikum')
export class ControllerController {
  constructor(private SERVICE: ServiceService) {}

  @Get()
  async getAllKomponen() {
    return await this.SERVICE.GET();
  }
  @Post()
  async postKomponen(@Body() PraktikumDTO: PraktikumDto) {
    return this.SERVICE.POST(PraktikumDTO);
  }
  @Delete()
  async deleteKomponen(@Query('id') id: string) {
    return this.SERVICE.DELETE(id);
  }
  @Put()
  async editKomponen(
    @Body() PraktikumDTO: PraktikumDto,
    @Query('id') id: string,
  ) {
    return this.SERVICE.EDIT(PraktikumDTO, id);
  }
}
