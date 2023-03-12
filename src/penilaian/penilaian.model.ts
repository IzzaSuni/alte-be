import Mongoose, { SchemaTypes } from 'mongoose';

export const penilaianSchema = new Mongoose.Schema({
  nilai_number: { type: String, required: true },
  grade: { type: Boolean, required: true },
  user_id: { type: SchemaTypes.ObjectId, ref: 'User' },
  praktikum_id: { type: SchemaTypes.ObjectId, ref: 'Praktikum' },
});

export interface Penilaian {
  id: string;
  nilai_number: string;
  grade: string;
  user_id: string;
  praktikum_id: string;
}
export type penilaianParam = {
  id: string;
  nilai_number: string;
  grade: string;
  user_id: string;
  praktikum_id: string;
};
export class penilaianDto {
  id: string;
  nilai_number: string;
  grade: string;
  user_id: string;
  praktikum_id: string;
}
