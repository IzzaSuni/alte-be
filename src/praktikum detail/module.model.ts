import Mongoose, { SchemaTypes } from 'mongoose';
import { PraktikumParam } from 'src/praktikum/praktikum.model';

export const praktikumDetailSchema = new Mongoose.Schema({
  module_name: { type: String, required: true },
  module_no: { type: Number, required: true },
  praktikum: { type: SchemaTypes.ObjectId, ref: 'Praktikum', required: true },
  file_id: { type: Object },
});

export const fileSchema = new Mongoose.Schema({
  file: { type: Object, required: true },
});

export interface ModuleFile {
  file: object;
}

export interface praktikumDetail {
  module_name: string;
  module_no: number;
  praktikum: PraktikumParam;
  file_id: string;
}

export type praktikumDetailParam = {
  module_name: string;
  id: string;
  module_no: number;
  praktikum: PraktikumParam;
};

export class praktikumDetailDto {
  module_name: string;
  id: string;
  module_no: number;
  praktikum: PraktikumParam;
  file_id: string;
}
