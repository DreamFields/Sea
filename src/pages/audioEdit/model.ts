/**
 * author: zt
 * date: 2020-11-02
 */

import { Effect, Reducer } from 'umi';
import { message } from 'antd';
import { EditAudio } from './service';

export interface StateType {
  audio: any;
  tips: any;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    setAudio: Effect;
    editAudio: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'pretreatment',

  state: {
    audio: undefined,
    tips: undefined,
  },

  effects: {
    *setAudio({ payload }, { call, put }) {
      console.log(payload);
      if (payload) {
        yield put({
          type: 'save',
          payload: { audio: payload },
        });
      }
    },
    *editAudio({ payload }, { call, put }) {
      const data = yield call(EditAudio, payload);
      if (data) {
        message.success('编辑音频成功');
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
