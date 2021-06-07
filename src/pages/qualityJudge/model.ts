import { Effect, Reducer } from 'umi';
import { ModifyQuality } from './service';
import { message } from 'antd';

export interface StateType {
  audio_id: any;
  audio_name: any;
  signal_type: any;
  db: any;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    setAudio: Effect;
    modifyQuality: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

// @ts-ignore
// @ts-ignore
const Model: ModelType = {
  namespace: 'qualityJudge',

  state: {
    audio_id: undefined,
    audio_name: undefined,
    signal_type: undefined,
    db: undefined,
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
    *modifyQuality({ payload }, { call, put }) {
      const data = yield call(ModifyQuality, payload);
      if (data) {
        message.success('提交成功！');
      } else {
        message.error('提交失败！');
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
