import Mongoose from 'mongoose';
import { PraktikumParam } from 'src/praktikum/praktikum.model';

export const moduleSchema = new Mongoose.Schema({
  module_name: { type: String },
  module_no: { type: Number },
  praktikum: { type: Object },
  file_id: { type: Object },
});
export const fileSchema = new Mongoose.Schema({
  file: { type: Object, required: true },
});

export interface ModuleFile {
  file: object;
}

export interface Module {
  module_name: string;
  module_no: number;
  praktikum: PraktikumParam;
  file_id: string;
}

export type ModuleParam = {
  module_name: string;
  id: string;
  module_no: number;
  praktikum: PraktikumParam;
};

export class ModuleDto {
  module_name: string;
  id: string;
  module_no: number;
  praktikum: PraktikumParam;
  file_id: string;
}
