/*
 * @Descripttion :
 * @Author       : HuRenbin
 * @LastEditors  : HuRenbin
 * @Date         : 2020-11-11 18:39:31
 * @LastEditTime : 2020-11-12 00:01:08
 * @github       : https://github.com/HlgdB/Seadata
 * @FilePath     : \Seadata-front\src\pages\features\model.ts
 */

import { Effect, Reducer } from 'umi';
import { message } from 'antd';
import {} from './service';

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
    setInfo: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

// @ts-ignore
// @ts-ignore
const Model: ModelType = {
  namespace: 'features',

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
    *setInfo({ payload }, { call, put }) {
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
