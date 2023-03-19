import Mongoose, { SchemaTypes } from 'mongoose';
import { JadwalParams } from 'src/jadwal/jadwal.model';

export const absenSchema = new Mongoose.Schema({
  data: {
    user: { type: SchemaTypes.ObjectId, ref: 'user' },
    clock_in: { type: Date, required: true },
    clock_out: { type: Date },
  },
  jadwal_id: { type: SchemaTypes.ObjectId, ref: 'jadwal' },
});

export interface Absen {
  data: {
    user: string;
    clock_in: string;
    clock_out: string;
  };
  jadwal_id: JadwalParams;
}
export type AbsenParam = {
  data: {
    user: string;
    clock_in: string;
    clock_out: string;
  };
  jadwal_id: JadwalParams;
};
export class AbsenDto {
  data: {
    user: string;
    clock_in: string;
    clock_out: string;
  };
  jadwal_id: JadwalParams;
}
