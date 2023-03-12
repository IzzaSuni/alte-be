import Mongoose from 'mongoose';
import { userSchema } from 'src/user/user.model';

export const absenSchema = new Mongoose.Schema({
  user: userSchema,
  clock_in: { type: Date, required: true },
  clock_out: { type: Date },
});

export interface Absen {
  clock_in: string;
  clock_out: string;
}
export type AbsenParam = {
  clock_in: string;
  clock_out: string;
};
export class AbsenDto {
  clock_in: string;
  clock_out: string;
}
