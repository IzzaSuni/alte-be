import Mongoose, { SchemaTypes } from 'mongoose';

export const tableSchema = new Mongoose.Schema({
  table_id: { type: String, required: true },
  location: { type: SchemaTypes.ObjectId, ref: 'location' },
});

export interface table {
  id: string;
  table_id: string;
  location: string;
}
export type tableParams = {
  id: string;
  table_id: string;
  location: string;
};
export class tableDTO {
  id: string;
  table_id: string;
  location: string;
}
