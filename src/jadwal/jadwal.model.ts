import Mongoose, { SchemaTypes } from 'mongoose';
import { GroupParam } from 'src/group/group.model';
import { locationParam } from 'src/location/location.model';
import { praktikumDetail } from 'src/praktikum detail/module.model';

export const jadwalSchema = new Mongoose.Schema({
  date: { type: String, required: true },
  start_at: { type: Date, required: true },
  end_at: { type: Date, required: true },
  is_PraktikumSchedule: { type: Boolean, required: true },
  location: { type: SchemaTypes.ObjectId, ref: 'location', required: true },
  praktikum_detail: {
    type: SchemaTypes.ObjectId,
    ref: 'praktikum_detail',
    required: true,
  },
  reason: { type: String, required: true },
  group: [{ type: SchemaTypes.ObjectId, ref: 'group' }],
  peminjaman_id: [{ type: SchemaTypes.ObjectId, ref: 'peminjaman' }],
  aproved: { type: Boolean, required: true },
  table: { type: SchemaTypes.ObjectId, ref: 'table', required: true },
  created_at: { type: Date },
  edited_at: { type: Date },
});

export interface Jadwal {
  date: string;
  start_at: string;
  end_at: string;
  id: string;
  is_PraktikumSchedule: boolean;
  location: locationParam;
  praktikum_detail: praktikumDetail;
  group: Array<GroupParam>;
  aproved: boolean;
  reason: string;
  peminjaman_id: object;
  created_at: string;
  edited_at: string;
  table: JadwalParams;
}

export type JadwalParams = {
  date: string;
  id: string;
  is_PraktikumSchedule: boolean;
  location: string;
  praktikum_detail: praktikumDetail;
  reason: string;
  created_at: string;
  edited_at: string;
  group: Array<GroupParam>;
  aproved: boolean;
  start_at: string;
  end_at: string;
  peminjaman_id: object;
  table: string;
};

export class JadwalDTO {
  date: string;
  id: string;
  is_PraktikumSchedule: boolean;
  location: string;
  praktikum_detail: praktikumDetail;
  reason: string;
  created_at: string;
  edited_at: string;
  group: Array<GroupParam>;
  aproved: boolean;
  start_at: string;
  end_at: string;
  peminjaman_id: object;
  table: string;
}
