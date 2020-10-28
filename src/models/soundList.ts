import { Effect, Reducer, Subscription } from 'umi';
import { message } from 'antd';
import { FetchSoundList } from '@/layouts/BasicLayout/service';

export interface StateType {
  sound_list?: any;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetchSoundList: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const Model: ModelType = {
  namespace: 'soundList',

  state: {
    sound_list: undefined,
  },

  effects: {
    *fetchSoundList({ payload }, { call, put }) {
      const data = yield call(FetchSoundList, payload);
      if (data) {
        yield put({
          type: 'save',
          payload: {
            sound_list: data,
          },
        });
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      // console.log({ ...state, ...payload });
      return { ...state, ...payload };
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // history.listen(({pathname}) => {
      //     if(pathname === '/' || pathname.search('/user') == -1) {
      //         dispatch({
      //             type: 'fetchSoundList',
      //         })
      //     }
      // });
    },
  },
};

export default Model;
