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
  async getAllPraktikum() {
    return await this.SERVICE.GET();
  }

  @Post()
  async createPraktikum(@Body() PraktikumDTO: PraktikumDto) {
    return this.SERVICE.POST(PraktikumDTO);
  }
  @Delete()
  async deletePraktikum(@Query('id') id: string) {
    return this.SERVICE.DELETE(id);
  }
  @Put()
  async editPrakikum(
    @Body() PraktikumDTO: PraktikumDto,
    @Query('id') id: string,
  ) {
    return this.SERVICE.EDIT(PraktikumDTO, id);
  }
}
