import Mongoose from 'mongoose';

export const jadwalSchema = new Mongoose.Schema({
  date: { type: Date, required: true },
  time: { type: Date, required: true },
  is_PraktikumSchedule: { type: Boolean, required: true },
  location: { type: String, required: true },
  praktikan_group: { type: Object, required: true },
  shift: { type: Object, required: true },
  praktikum_name: { type: String, required: true },
  reason: { type: String, required: true },
  aproved: { type: Boolean, required: true },
  aproved_by: { type: Boolean, required: true },
  created_at: { type: Date },
  edited_at: { type: Date },
});

export interface Jadwal {
  id: string;
  date: string;
  time: string;
  is_PraktikumSchedule: boolean;
  location: string;
  praktikan_group: object;
  shift: object;
  praktikum_name: string;
  reason: string;
  created_at: string;
  edited_at: string;
}
