import Mongoose, { SchemaTypes } from 'mongoose';
import { PraktikumParam } from 'src/praktikum/praktikum.model';

export const groupSchema = new Mongoose.Schema({
  shift: { type: String, required: true },
  group: { type: Number, required: true },
  praktikum: { type: SchemaTypes.ObjectId, ref: 'Praktikum' },
  user_id: [{ type: SchemaTypes.ObjectId, ref: 'User' }],
  created_at: { type: Date },
  edited_at: { type: Date },
});

export interface Group {
  shift: string;
  group: number;
}
export type GroupParam = {
  shift: string;
  group: number;
  praktikum: PraktikumParam;
};
export class GroupDto {
  shift: string;
  group: number;
  praktikum: PraktikumParam;
}
