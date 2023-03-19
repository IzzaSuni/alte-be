import mongoose, { SchemaTypes } from 'mongoose';
import { KomponenParam } from 'src/komponen/komponen.model';

export const komponenDetailSchema = new mongoose.Schema({
  komponen_id: { type: SchemaTypes.ObjectId, ref: 'komponen' },
  value: { type: String, required: true },
  amount: { type: Number, required: true },
  available_amount: { type: Number },
  edited_at: { type: Date },
  edited_log: {
    user_id: { type: SchemaTypes.ObjectId, ref: 'user' },
    notes: { type: String },
    date: { type: Date },
    before: [
      {
        user_id: { type: SchemaTypes.ObjectId, ref: 'user' },
        notes: { type: String },
        edited_at: { type: Date },
        value: { type: String, required: true },
        amount: { type: Number, required: true },
        available_amount: { type: Number },
      },
    ],
  },
});

type edited = {
  before: any;
  user_id: string;
  notes: string;
  date: string;
  edited_log: { before: Array<editKomponenDetailParam> };
  value: string;
  amount: number;
  available_amount: number;
  komponen: KomponenParam;
};

export interface KomponenDetail {
  value: string;
  amount: number;
  available_amount: number;
  edited_log: edited;
  edited_at: string;
  komponen: KomponenParam;
}

export type KomponenDetailParam = {
  value: string;
  amount: number;
  available_amount: number;
  edited_log: edited;
  komponen: KomponenParam;
};

export type editKomponenDetailParam = {
  value: string;
  amount: number;
  available_amount: number;
  edited_log: edited;
  user_id: string;
  edited_at: string;
  notes: string;
  komponen: KomponenParam;
};

export class KomponenDetailDto {
  value: string;
  amount: number;
  available_amount: number;
  edited_log: edited;
  komponen: KomponenParam;
}
