import Mongoose, { SchemaTypes } from 'mongoose';
import { GroupParam } from 'src/group/group.model';
import { PraktikumParam } from 'src/praktikum/praktikum.model';

export const jadwalSchema = new Mongoose.Schema({
  date: { type: Date, required: true },
  start_at: { type: Date, required: true },
  end_at: { type: Date, required: true },
  is_PraktikumSchedule: { type: Boolean, required: true },
  location: { type: String, required: true },
  praktikum: { type: String, required: true },
  reason: { type: String, required: true },
  aproved: { type: Boolean, required: true },
  group: [{ type: SchemaTypes.ObjectId, ref: 'Group' }],
  komponens: [{ type: SchemaTypes.ObjectId, ref: 'Komponen' }],
  created_at: { type: Date },
  edited_at: { type: Date },
  table: { type: String },
});

export interface Jadwal {
  date: string;
  start_at: string;
  end_at: string;
  id: string;
  is_PraktikumSchedule: boolean;
  location: string;
  praktikum: PraktikumParam;
  group: GroupParam;
  aproved: boolean;
  reason: string;
  komponens: object;
  created_at: string;
  edited_at: string;
  table: string;
}

export type JadwalParams = {
  date: string;
  id: string;
  is_PraktikumSchedule: boolean;
  location: string;
  praktikum: PraktikumParam;
  reason: string;
  created_at: string;
  edited_at: string;
  group: GroupParam;
  aproved: boolean;
  start_at: string;
  end_at: string;
  komponens: object;
  table: string;
};

export class JadwalDTO {
  date: string;
  id: string;
  is_PraktikumSchedule: boolean;
  location: string;
  praktikum: PraktikumParam;
  reason: string;
  created_at: string;
  edited_at: string;
  group: GroupParam;
  aproved: boolean;
  start_at: string;
  end_at: string;
  komponens: object;
  table: string;
}
