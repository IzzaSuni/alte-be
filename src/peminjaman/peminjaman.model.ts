import mongoose, { SchemaTypes } from 'mongoose';
import { JadwalParams } from 'src/jadwal/jadwal.model';
import { KomponenDetailParam } from 'src/komponen_detail/komponen.model';
import { userParam } from 'src/user/user.model';

export const peminjamanSchema = new mongoose.Schema({
  komponen_detail_id: {
    type: SchemaTypes.ObjectId,
    ref: 'komponen_detail',
    required: true,
  },
  amount: { type: Number, required: true },
  jadwal_id: { type: SchemaTypes.ObjectId, ref: 'jadwal', required: true },
  asprak: { type: SchemaTypes.ObjectId, ref: 'user', required: true },
  aproved: {
    apsrak: { type: Boolean, required: true },
    laboran: { type: Boolean, required: true },
  },
  group_id: { type: SchemaTypes.ObjectId, ref: 'group', required: true },
  approved_at: { type: Date },
});

export interface Peminjaman {
  komponen_detail_id: KomponenDetailParam;
  amount: number;
  jadwal_id: JadwalParams;
  asprak: userParam;
  aproved: {
    apsrak: boolean;
    laboran: boolean;
  };
  group_id: userParam;
  approved_at: string;
}

export type PeminjamanParam = {
  komponen_detail_id: KomponenDetailParam;
  amount: number;
  jadwal_id: JadwalParams;
  asprak: userParam;
  aproved: {
    apsrak: boolean;
    laboran: boolean;
  };
  group_id: userParam;
};

export type approvingParam = {
  user_id: userParam;
  aprroved: boolean;
};
