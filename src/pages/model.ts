/*
 * author: TimothyZhung
 * date: 2020-11-03
 */
import { Effect, Reducer, Subscription } from 'umi';
import { GetAudio, GetPeople } from './service';
export interface DataType {
  x: string;
  y: number;
}
export interface stateType {
  data: DataType[];
}
export interface ModelType {
  namespace: string;
  state: stateType;
  reducers: {
    save: Reducer<stateType>;
  };
  effects: {
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
    data: [],
  },
  reducers: {
    save(state, { payload }) {
      // console.log({ ...state, ...payload });
      return { ...state, ...payload };
    },
  },
  effects: {
    *getAudio({ payload }, { put, call }) {
      const data = yield call(GetAudio, payload);
      if (data) {
        yield put({
          type: 'save',
          payload: data,
        });
      }
    },
    *getPeople({ payload }, { put, call }) {
      const data = yield call(GetPeople, payload);
      if (data) {
        yield put({
          type: 'save',
          payload: data,
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/#') {
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
