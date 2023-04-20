import mongoose from 'mongoose';

export const PraktikumSchema = new mongoose.Schema({
  praktikum_name: { type: String, required: true },
  class_code: { type: String, required: true },
  created_at: { type: Date },
  edited_at: { type: Date },
  year: { type: Number, required: true },
});

export interface Praktikum {
  id: string;
  praktikum_name: string;
  class_code: string;
  created_at: string;
  edited_at: string;
}
export type PraktikumParam = {
  id: string;
  praktikum_name: string;
  class_code: string;
  created_at: string;
  edited_at: string;
};

export class PraktikumDto {
  id: string;
  praktikum_name: string;
  class_code: string;
  created_at: string;
  edited_at: string;
}
