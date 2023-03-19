import mongoose, { SchemaTypes } from 'mongoose';

export const PraktikumSchema = new mongoose.Schema({
  praktikum_name: { type: String, required: true },
  class_code: { type: String, required: true },
  created_at: { type: Date },
  edited_at: { type: Date },
  module: [{ type: SchemaTypes.ObjectId, ref: 'Module' }],
  year: { type: String, required: true },
});

export interface Praktikum {
  _id: string;
  praktikum_name: string;
  class_code: string;
  created_at: string;
  edited_at: string;
  module: Array<object>;
}
export type PraktikumParam = {
  _id: string;
  praktikum_name: string;
  class_code: string;
  created_at: string;
  edited_at: string;
  module: object;
};
export class PraktikumDto {
  _id: string;
  praktikum_name: string;
  class_code: string;
  created_at: string;
  edited_at: string;
  module: object;
}
