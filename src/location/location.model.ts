import Mongoose, { SchemaTypes } from 'mongoose';
import { tableParams } from 'src/table/table.model';

export const locationSchema = new Mongoose.Schema({
  location_name: { type: String, required: true },
  laboran: [{ type: String, required: true }],
  table: [{ type: SchemaTypes.ObjectId, ref: 'table' }],
});

export interface location {
  location_name: string;
  laboran: Array<string>;
  table: tableParams[];
}
export type locationParam = {
  id: string;
  location_name: string;
  laboran: Array<string>;
  table: tableParams[];
};
export class locationDTO {
  id: string;
  location_name: string;
  laboran: Array<string>;
  table: tableParams[];
}
