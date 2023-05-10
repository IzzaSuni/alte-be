import Mongoose, { SchemaTypes } from 'mongoose';

export const tableSchema = new Mongoose.Schema({
  table_id: { type: String, required: true },
  location: { type: SchemaTypes.ObjectId, ref: 'location' },
  ocupied: { type: Boolean, default: false },
});

export interface table {
  id: string;
  table_id: string;
  location: string;
  ocupied: boolean;
}
export type tableParams = {
  id: string;
  table_id: string;
  location: string;
  ocupied: boolean;
};
export class tableDTO {
  id: string;
  table_id: string;
  location: string;
  ocupied: boolean;
}
