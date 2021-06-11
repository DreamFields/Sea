import { Effect, Reducer } from 'umi';
import {
  ModifyQuality,
  FetchLevel,
  FetchManualLevel,
  FetchAutoLevel,
  ModifyAutoLevel,
} from './service';
import { message } from 'antd';

export interface StateType {
  audio_id: any;
  audio_name: any;
  signal_type: any;
  level: any;
  manual_level: any;
  auto_level: any;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    setAudio: Effect;
    modifyQuality: Effect;
    fetchLevel: Effect;
    fetchAutoLevel: Effect;
    modifyAutoLevel: Effect;
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
    level: undefined,
    manual_level: undefined,
    auto_level: undefined,
  },

  effects: {
    *setAudio({ payload }, { call, put }) {
      // console.log(payload);
      if (payload) {
        yield put({
          type: 'save',
          payload: payload,
        });
        yield put({
          type: 'fetchLevel',
          payload: { sid: payload.audio_id },
        });
      }
    },
    *modifyQuality({ payload }, { call, put }) {
      const data = yield call(ModifyQuality, payload);
      if (data) {
        message.success('提交成功！');
        yield put({
          type: 'fetchLevel',
          payload: { sid: payload.sid },
        });
        yield put({
          type: 'fetchManualLevel',
          payload: { sid: payload.sid },
        });
      } else {
        message.error('提交失败！');
      }
    },
    *fetchLevel({ payload }, { call, put }) {
      // 获取最终结果
      const data_1 = yield call(FetchLevel, payload);
      // 获取手动评价结果
      const data_2 = yield call(FetchManualLevel, payload);

      console.log(data_1, data_2);

      if (data_1 && data_2) {
        yield put({
          type: 'save',
          payload: {
            level: data_1,
            manual_level: typeof data_2 === 'object' ? data_2 : null,
          },
        });
      } else {
        message.error('获取音频评价失败！');
      }
    },
    *fetchAutoLevel({ payload }, { call, put }) {
      const data = yield call(FetchAutoLevel, payload);
      if (data) {
        yield put({
          type: 'save',
          payload: { auto_level: data },
        });
        message.success('自动评价成功！');
      } else {
        message.error('自动评价失败！');
      }
    },
    *modifyAutoLevel({ payload }, { call, put }) {
      const data = yield call(ModifyAutoLevel, payload);
      if (data) {
        yield put({
          type: 'fetchLevel',
          payload: { sid: payload.sid },
        });
        message.success('保存自动评价结果成功！');
      } else {
        message.error('保存自动评价结果失败！');
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
