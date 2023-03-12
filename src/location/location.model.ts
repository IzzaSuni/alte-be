import Mongoose, { SchemaTypes } from 'mongoose';

export const locationSchema = new Mongoose.Schema({
  location_name: { type: String, required: true },
});

export interface location {
  location_name: string;
}
