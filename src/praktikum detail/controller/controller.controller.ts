import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { praktikumDetailDto } from '../module.model';
import { ServiceService } from '../service/service.service';

@Controller('module')
export class ControllerController {
  constructor(private SERVICE: ServiceService) {}

  @Get()
  getModule() {
    return this.SERVICE.GET();
  }

  @Get('details')
  findModule(@Query('id') id: string) {
    return this.SERVICE.findModulPraktikum(id);
  }

  @Get('download')
  downloadModule(@Query('id') moduleId: string) {
    return this.SERVICE.Download(moduleId);
  }

  @Post()
  @UseInterceptors(FileInterceptor('document'))
  uploadFile(
    @UploadedFile() file: { buffer: object; mimetype: string },
    @Body() praktikumDetailDtos: praktikumDetailDto,
    @Query('id') praktikumId: string,
  ) {
    console.log(file);
    return this.SERVICE.POST(file, praktikumDetailDtos, praktikumId);
  }

  @Put()
  @UseInterceptors(FileInterceptor('file'))
  editFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() praktikumDetailDtos: praktikumDetailDto,
    @Query('id') moduleId: string,
  ) {
    return this.SERVICE.EDIT(file, praktikumDetailDtos, moduleId);
  }

  @Delete()
  deleteFile(@Query('id') moduleId: string) {
    return this.SERVICE.DELETE(moduleId);
  }
}
