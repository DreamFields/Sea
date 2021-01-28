import { Effect, Reducer } from 'umi';
import { message } from 'antd';
import {} from './service';

export interface StateType {
  audio_id: any;
  audio_name: any;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    setAudio: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'target',

  state: {
    audio_id: undefined,
    audio_name: undefined,
  },

  effects: {
    *setAudio({ payload }, { call, put }) {
      // console.log(payload);
      if (payload) {
        yield put({
          type: 'save',
          payload: payload,
        });
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};

export default Model;
