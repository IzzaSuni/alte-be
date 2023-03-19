import Mongoose, { SchemaTypes } from 'mongoose';

export const praktikansSchema = new Mongoose.Schema({
  praktikum_id: { type: SchemaTypes.ObjectId, ref: 'praktium', required: true },
  data: {
    class: { type: String },
    praktikans: [
      {
        no: { type: Number },
        name: { type: String },
        nim: { type: Number },
        score: { type: Number },
      },
    ],
  },
});

type praktikansParam = {
  class: string;
  praktikans: Array<{ no: number; name: string; nim: number; score: number }>;
};

export interface praktikan {
  praktikum_id: string;
  data: Array<praktikansParam>;
}
export type praktikanParam = {
  praktikum_id: string;
  data: Array<praktikansParam>;
};
export class praktikanDTO {
  praktikum_id: string;
  data: Array<praktikansParam>;
}
