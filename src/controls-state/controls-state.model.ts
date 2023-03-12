import Mongoose from 'mongoose';

export const controlSchema = new Mongoose.Schema({
  relay1: { type: Boolean },
  relay2: { type: Boolean },
  relay3: { type: Boolean },
  ac_state: { type: Object },
  ac_controls: { type: Object },
});

export interface ControlState {
  relay1: boolean;
  relay2: boolean;
  relay3: boolean;
  ac_state: boolean;
  ac_controls: object;
}
export type ControlStateParam = {
  relay1: boolean;
  relay2: boolean;
  relay3: boolean;
  ac_state: boolean;
  ac_controls: object;
};
export class ControlStateDto {
  ac_controls: object;
}
