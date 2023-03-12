import { Body, Controller, Get, Patch } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { sendRespObj } from 'src/utils/func';
import { ControlState, ControlStateDto } from './controls-state.model';

@Controller('controls-state')
export class ControlsStateController {
  constructor(
    @InjectModel('ControlState')
    private readonly ControlModel: Model<ControlState>,
  ) {}
  @Get()
  async getControlState() {
    return await this.ControlModel.find().exec();
  }
  @Patch()
  async setControlState(@Body() ControlStateDTO: ControlStateDto) {
    const { ac_controls }: any = ControlStateDTO;

    const update = await this.ControlModel.findByIdAndUpdate(
      '63e4fcf891f3c8e32262f367',
      {
        ac_controls,
      },
    );
    if (update) return sendRespObj(1, 'sukses menambah control', update);
    return sendRespObj(2, 'gagal menambah control', update);
  }
}
