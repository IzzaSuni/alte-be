import mongoose, { SchemaTypes } from 'mongoose';
import { JadwalParams } from 'src/jadwal/jadwal.model';
import { KomponenDetailParam } from 'src/komponen_detail/komponen.model';
import { userParam } from 'src/user/user.model';

export const peminjamanSchema = new mongoose.Schema({
  komponen: [
    {
      komponen_detail_id: {
        type: SchemaTypes.ObjectId,
        ref: 'komponen_detail',
        required: true,
      },
      amount: { type: Number },
    },
  ],
  jadwal_id: { type: SchemaTypes.ObjectId, ref: 'jadwal', required: true },
  asprak: { type: SchemaTypes.ObjectId, ref: 'user', required: true },
  aproved: {
    apsrak: { type: Boolean, required: true },
    laboran: { type: Boolean, required: true },
  },
  group_id: { type: SchemaTypes.ObjectId, ref: 'group', required: true },
  approved_at: { type: Date },
  approved_by: {
    asprak: { type: SchemaTypes.ObjectId, ref: 'user' },
    laboran: { type: SchemaTypes.ObjectId, ref: 'user' },
  },
  return_condition: {
    komponen: [
      {
        komponen_detail_id: {
          type: SchemaTypes.ObjectId,
          ref: 'komponen_detail',
          required: true,
        },
        amount: { type: Number },
      },
    ],
    notes: { type: String },
  },
  notes: { type: String },
});

export type peminjamanKomponenParam = {
  komponen_detail_id: KomponenDetailParam;
  amount: number;
};

export interface Peminjaman {
  komponen: Array<peminjamanKomponenParam>;
  jadwal_id: JadwalParams;
  asprak: userParam;
  aproved: {
    apsrak: boolean;
    laboran: boolean;
  };
  group_id: userParam;
  approved_at: string;
  approved_by: {
    asprak: userParam;
    laboran: userParam;
  };
  return_condition: {
    komponen: Array<peminjamanKomponenParam>;
    notes: string;
  };
  notes: string;
}

export type PeminjamanParam = {
  komponen: Array<peminjamanKomponenParam>;
  amount: number;
  jadwal_id: JadwalParams;
  asprak: userParam;
  aproved: {
    apsrak: boolean;
    laboran: boolean;
  };
  group_id: userParam;
  approved_by: {
    asprak: userParam;
    laboran: userParam;
  };
  return_condition: {
    komponen: Array<peminjamanKomponenParam>;
    notes: string;
  };
};

export type approvingParam = {
  user_id: userParam;
  aprroved: boolean;
  notes: string;
};

export type returnParam = {
  komponen: Array<peminjamanKomponenParam>;
  notes: string;
  user_id: userParam;
};
