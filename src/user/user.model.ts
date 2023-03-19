import Mongoose from 'mongoose';

export const userSchema = new Mongoose.Schema({
  fullname: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  angkatan: { type: Number, required: true },
  nim: { type: Number, required: true },
  created_at: { type: Date },
  edited_at: { type: Date },
  role: {
    main: { type: String, required: true },
    secondary: { type: String },
  },
  finger_id: {
    type: Number,
  },
  is_finger_registered: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: { type: String },
  profile: { type: Object },
  socket_id: { type: String },
});

export interface User {
  id: string;
  fullname: string;
  password: string;
  email: string;
  angkatan: number;
  nim: number;
  role: string;
  finger_id: object;
  resetPasswordToken: string;
  created_at: string;
  edited_at: string;
  socket_id: string;
  profile: object;
}

export type userParam = {
  id: string;
  fullname: string;
  password: string;
  email: string;
  angkatan: number;
  nim: number;
  role: string;
  finger_id: object;
  resetPasswordToken: string;
  created_at: string;
  edited_at: string;
  socket_id: string;
  profile: object;
};
