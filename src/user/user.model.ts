import Mongoose from 'mongoose';

export const userSchema = new Mongoose.Schema({
  fullname: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  angkatan: { type: Number },
  nim: { type: Number },
  created_at: { type: Date },
  role: { type: String },
  finger_id: { type: Number },
  resetPasswordToken: { type: String },
});

export interface User {
  id: string;
  fullname: string;
  password: string;
  email: string;
  angkatan: number;
  nim: number;
  created_at: string;
  role: string;
  finger_id: string;
  resetPasswordToken: string;
}
