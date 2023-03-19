import Mongoose, { SchemaTypes } from 'mongoose';
import { KomponenDetailParam } from 'src/komponen_detail/komponen.model';

export const komponenSchema = new Mongoose.Schema({
  name: { type: String, required: true },
  isPersist: { type: Boolean, required: true },
  komponen_detail: [{ type: SchemaTypes.ObjectId, ref: 'komponen_detail' }],
  edited_at: { type: String },
  total: { type: Number },
});

export interface Komponen {
  name: string;
  isPersist: boolean;
  komponen_detail: Array<KomponenDetailParam>;
  edited_at: string;
}

export type KomponenParam = {
  name: string;
  isPersist: boolean;
  komponen_detail: Array<KomponenDetailParam>;
  edited_at: string;
};

export class KomponenDto {
  name: string;
  isPersist: boolean;
  komponen_detail: Array<KomponenDetailParam>;
  edited_at: string;
}
