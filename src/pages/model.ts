/*
 * author: TimothyZhung
 * date: 2020-11-03
 */
import { Effect, Reducer, Subscription } from 'umi';
import {
  GetActive_pulse,
  GetTarget_echo,
  GetRadiated_noise,
  GetAudio,
  GetPeople,
} from './service';
export interface stateType {
  active_pulseData?: any;
  target_echoData?: any;
  radiated_noiseData?: any;
  peopleData?: any;
}
export interface ModelType {
  namespace: string;
  state: stateType;
  reducers: {
    save: Reducer<stateType>;
  };
  effects: {
    getActive_pulse: Effect;
    getTarget_echo: Effect;
    getRadiated_noise: Effect;
    getAudio: Effect;
    getPeople: Effect;
  };

  subscriptions: {
    setup: Subscription;
  };
}

const Model: ModelType = {
  namespace: 'mainPage',
  state: {
    active_pulseData: undefined,
    target_echoData: undefined,
    radiated_noiseData: undefined,
    peopleData: undefined,
  },
  reducers: {
    save(state, { payload }) {
      // console.log({ ...state, ...payload });
      return { ...state, ...payload };
    },
  },
  effects: {
    *getActive_pulse({ payload }, { put, call }) {
      const data = yield call(GetActive_pulse, payload);
      if (data) {
        yield put({
          type: 'save',
          payload: {
            active_pulseData: data,
          },
        });
      }
    },
    *getTarget_echo({ payload }, { put, call }) {
      const data = yield call(GetTarget_echo, payload);
      if (data) {
        yield put({
          type: 'save',
          payload: {
            target_echoData: data,
          },
        });
      }
    },
    *getRadiated_noise({ payload }, { put, call }) {
      const data = yield call(GetRadiated_noise, payload);
      if (data) {
        yield put({
          type: 'save',
          payload: {
            radiated_noiseData: data,
          },
        });
      }
    },
    *getAudio({ payload }, { put, call }) {
      const data = yield call(GetAudio, payload);
      console.log(data);
      if (data) {
        yield put({
          type: 'save',
          payload: {
            radiated_noiseData: data.radiated_count,
            target_echoData: data.target_count,
            active_pulseData: data.active_count,
            excellent: data.count1,
            good: data.count2,
            medium: data.count3,
            poor: data.count4,
          },
        });
      }
    },
    *getPeople({ payload }, { put, call }) {
      const data = yield call(GetPeople, payload);
      if (data) {
        yield put({
          type: 'save',
          payload: {
            peopleData: data,
          },
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/') {
          dispatch({
            type: 'getAudio',
          });
          dispatch({
            type: 'getPeople',
          });
        }
      });
    },
  },
};

export default Model;
