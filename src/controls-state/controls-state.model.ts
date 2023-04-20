import Mongoose from 'mongoose';

export const controlSchema = new Mongoose.Schema({
  relay1: { type: Boolean },
  relay2: { type: Boolean },
  relay3: { type: Boolean },
  ac_state: {
    1: {
      isOn: { type: Boolean },
      temperature: { type: Number },
    },
    2: {
      isOn: { type: Boolean },
      temperature: { type: Number },
    },
  },
  isOnline: { type: Boolean },
  onlineId: { type: String },
});

export interface ControlState {
  relay1: boolean;
  relay2: boolean;
  relay3: boolean;
  ac_state: {
    1: {
      isOn: boolean;
      temperature: number;
    };
    2: {
      isOn: boolean;
      temperature: number;
    };
  };
  isOnline: boolean;
  onlineId: string;
}
export type ControlStateParam = {
  relay1: boolean;
  relay2: boolean;
  relay3: boolean;
  ac_state: {
    1: {
      isOn: boolean;
      temperature: number;
    };
    2: {
      isOn: boolean;
      temperature: number;
    };
  };
  isOnline: boolean;
  onlineId: string;
};
