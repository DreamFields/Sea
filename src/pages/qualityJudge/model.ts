import { Effect, Reducer } from 'umi';
import { ModifyQuality, FetchManualLevel, FetchAutoLevel } from './service';
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
      } else {
        message.error('提交失败！');
      }
    },
    *fetchLevel({ payload }, { call, put }) {
      // 获取手动评价结果
      const data = yield call(FetchManualLevel, payload);

      console.log(data);

      if (data) {
        yield put({
          type: 'save',
          payload: {
            level: data.manual_quality,
            manual_level: data,
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
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};

export default Model;
