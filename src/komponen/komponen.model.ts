import Mongoose from 'mongoose';

export const komponenSchema = new Mongoose.Schema({
  name: { type: String, required: true },
  isPersist: { type: Boolean, required: true },
  amount: { type: Number, required: true },
  komponen_code: { type: String, required: true },
  available: { type: Number, required: true },
});

export interface Komponen {
  name: string;
  isPersist: boolean;
  amount: number;
  komponen_code: string;
  available: number;
}
export type KomponenParam = {
  id: string;
  name: string;
  isPersist: boolean;
  amount: number;
  komponen_code: string;
  available: number;
};
export class KomponenDto {
  id: string; 
  name: string;
  isPersist: boolean;
  amount: number;
  komponen_code: string;
  available: number;
}
