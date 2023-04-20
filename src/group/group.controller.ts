import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { EditGroupParam, GroupDto } from './group.model';
import { GroupService } from './group.service';

@Controller('group')
export class GroupController {
  constructor(private SERVICE: GroupService) {}

  @Get()
  async getAllKomponen() {
    return await this.SERVICE.GET();
  }
  @Post()
  async postKomponen(@Body() DTO: GroupDto) {
    return this.SERVICE.POST(DTO);
  }
  @Delete()
  async deleteKomponen(@Query() id: { id: string }) {
    return this.SERVICE.DELETE(id);
  }
  @Put()
  async editKomponen(@Body() payload: EditGroupParam) {
    return this.SERVICE.EDIT(payload);
  }
}
