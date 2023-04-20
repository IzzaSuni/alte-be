import Mongoose, { SchemaTypes } from 'mongoose';
import { PraktikumParam } from 'src/praktikum/praktikum.model';
import { userParam } from 'src/user/user.model';

export const groupSchema = new Mongoose.Schema({
  group: { type: String, required: true },
  praktikum: { type: SchemaTypes.ObjectId, ref: 'praktikum' },
  users: [{ type: SchemaTypes.ObjectId, ref: 'users' }],
  created_at: { type: Date },
  edited_at: { type: Date },
});

export interface Group {
  id: string;
  group: string;
  praktikum: PraktikumParam;
  users: Array<userParam>;
}

export type EditGroupParam = {
  userIdX: string;
  userIdY: string;
  praktikumId: PraktikumParam;
  groupIdX: string;
  groupIdY: string;
};
export type GroupParam = {
  id: string;
  group: string;
  praktikum: PraktikumParam;
  users: Array<userParam>;
};
export class GroupDto {
  id: string;
  group: string;
  praktikum: PraktikumParam;
  users: Array<userParam>;
}
