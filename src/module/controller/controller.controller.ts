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
import { ModuleDto } from '../module.model';
import { ServiceService } from '../service/service.service';

@Controller('module')
export class ControllerController {
  constructor(private SERVICE: ServiceService) {}

  @Get()
  getModule() {
    return this.SERVICE.GET();
  }

  @Get('download')
  downloadModule(@Query('id') moduleId: string) {
    return this.SERVICE.Download(moduleId);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() moduleDto: ModuleDto,
    @Query('id') praktikumId: string,
  ) {
    return this.SERVICE.POST(file, moduleDto, praktikumId);
  }

  @Put()
  @UseInterceptors(FileInterceptor('file'))
  editFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() moduleDto: ModuleDto,
    @Query('id') moduleId: string,
  ) {
    return this.SERVICE.EDIT(file, moduleDto, moduleId);
  }

  @Delete()
  deleteFile(@Query('id') moduleId: string) {
    return this.SERVICE.DELETE(moduleId);
  }
}
