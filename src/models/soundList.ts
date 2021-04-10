/*
 * @Descripttion :
 * @Author       : HuRenbin
 * @LastEditors  : HuRenbin
 * @Date         : 2020-10-28 09:56:58
 * @LastEditTime : 2020-12-08 15:02:46
 * @github       : https://github.com/HlgdB/Seadata
 * @FilePath     : \Seadata-front\src\models\soundList.ts
 */
import { Effect, Reducer, Subscription } from 'umi';
import { message } from 'antd';
import { FetchSoundList, SearchSoundList } from '@/layouts/BasicLayout/service';

export interface StateType {
  sound_list?: any;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetchSoundList: Effect;
    searchSoundList: Effect;
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
      // console.log(data);
      if (data) {
        yield put({
          type: 'save',
          payload: {
            sound_list: data.reverse(),
          },
        });
      }
    },
    *searchSoundList({ payload }, { call, put }) {
      const data = yield call(SearchSoundList, payload);
      if (data) {
        console.log('searchData', data);
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
