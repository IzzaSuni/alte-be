import Mongoose from 'mongoose';

export const locationSchema = new Mongoose.Schema({
  location_name: { type: String, required: true },
  laboran: [{ type: String, required: true }],
});

export interface location {
  location_name: string;
  laboran: Array<string>;
}
export type locationParam = {
  location_name: string;
  laboran: Array<string>;
};
export class locationDTO {
  id: string;
  location_name: string;
  laboran: Array<string>;
}
