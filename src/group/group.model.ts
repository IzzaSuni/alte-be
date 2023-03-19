import Mongoose, { SchemaTypes } from 'mongoose';
import { PraktikumParam } from 'src/praktikum/praktikum.model';
import { userParam } from 'src/user/user.model';

export const groupSchema = new Mongoose.Schema({
  group: { type: Number, required: true },
  praktikum: { type: SchemaTypes.ObjectId, ref: 'praktikum' },
  users: [{ type: SchemaTypes.ObjectId, ref: 'user' }],
  created_at: { type: Date },
  edited_at: { type: Date },
});

export interface Group {
  group: number;
  praktikum: PraktikumParam;
  user: Array<userParam>;
}
export type GroupParam = {
  group: number;
  praktikum: PraktikumParam;
  user: Array<userParam>;
};
export class GroupDto {
  group: number;
  praktikum: PraktikumParam;
  user: Array<userParam>;
}
