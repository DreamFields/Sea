/*
 * author: TimothyZhung
 * date: 2020-11-03
 */
import { Effect, Reducer, Subscription } from 'umi';
import {
  GetActive_pulse,
  GetTarget_echo,
  GetRadiated_noise,
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
            type: 'getActive_pulse',
          });
          dispatch({
            type: 'getTarget_echo',
          });
          dispatch({
            type: 'getRadiated_noise',
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
