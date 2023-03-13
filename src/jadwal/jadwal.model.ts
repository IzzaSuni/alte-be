import Mongoose, { SchemaTypes } from 'mongoose';
import { GroupParam } from 'src/group/group.model';

export const jadwalSchema = new Mongoose.Schema({
  date: { type: Date, required: true },
  time: { type: Date, required: true },
  is_PraktikumSchedule: { type: Boolean, required: true },
  location: { type: String, required: true },
  shift: { type: Object, required: true },
  praktikum_name: { type: String, required: true },
  reason: { type: String, required: true },
  aproved: { type: Boolean, required: true },
  group: [{ type: SchemaTypes.ObjectId, ref: 'Group' }],
  komponen_id: [{ type: SchemaTypes.ObjectId, ref: 'Komponen' }],
  // tools: [{ type: SchemaTypes.ObjectId, ref: 'komponen' }],
  created_at: { type: Date },
  edited_at: { type: Date },
});

export interface Jadwal {
  id: string;
  date: any;
  time: string;
  is_PraktikumSchedule: boolean;
  location: string;
  praktikan_group: object;
  shift: object;
  praktikum_name: string;
  group: GroupParam;
  reason: string;
  created_at: string;
  edited_at: string;
}
export type JadwalParams = {
  id: string;
  date: any;
  time: string;
  is_PraktikumSchedule: boolean;
  location: string;
  praktikan_group: object;
  shift: object;
  praktikum_name: string;
  reason: string;
  created_at: string;
  edited_at: string;
  group: GroupParam;
};
