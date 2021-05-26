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
import {
  FetchSoundList,
  SearchByname_date,
  SearchBystype,
  SearchByfname,
  SearchBydepth,
  SearchBypower_engine,
  SearchBypropeller,
  SearchBycountry,
  SearchByap,
  SearchByas,
  SearchByrn,
  SearchByte,
  SearchByplatform,
  SearchByts,
  SearchBylocation,
  SearchByct,
  SearchBydistance,
  SearchByspeed,
  SearchBywater,
  SearchByam,
  SearchBypm,
  GetAudioInforById,
} from '@/layouts/BasicLayout/service';

export interface StateType {
  sound_list?: any;
  detail?: any;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetchSoundList: Effect;
    searchByname_date: Effect;
    searchBystype: Effect;
    searchByfname: Effect;
    searchBydepth: Effect;
    searchBypower_engine: Effect;
    searchBypropeller: Effect;
    searchBycountry: Effect;
    searchByap: Effect;
    searchByas: Effect;
    searchByrn: Effect;
    searchByte: Effect;
    searchByplatform: Effect;
    searchByts: Effect;
    searchBylocation: Effect;
    searchByct: Effect;
    searchBydistance: Effect;
    searchByspeed: Effect;
    searchBywater: Effect;
    searchByam: Effect;
    searchBypm: Effect;
    getAudioInforById: Effect;
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

    *getAudioInforById({ payload, setitem }, { call, put }) {
      const data = yield call(GetAudioInforById, payload);
      if (data) {
        // console.log("detail", data);
        setitem(data.sound_list_specific_data);
        // 可以put但没必要
        // yield put({
        //   type: 'save',
        //   payload:{
        //     detail: data
        //   }
        // });
      }
    },

    *searchByname_date({ payload }, { call, put }) {
      const data = yield call(SearchByname_date, payload);
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

    *searchBystype({ payload }, { call, put }) {
      const data = yield call(SearchBystype, payload);
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

    *searchByfname({ payload }, { call, put }) {
      const data = yield call(SearchByfname, payload);
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

    *searchBydepth({ payload }, { call, put }) {
      const data = yield call(SearchBydepth, payload);
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

    *searchBypower_engine({ payload }, { call, put }) {
      const data = yield call(SearchBypower_engine, payload);
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

    *searchBypropeller({ payload }, { call, put }) {
      const data = yield call(SearchBypropeller, payload);
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

    *searchBycountry({ payload }, { call, put }) {
      const data = yield call(SearchBycountry, payload);
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

    *searchByap({ payload }, { call, put }) {
      const data = yield call(SearchByap, payload);
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

    *searchByas({ payload }, { call, put }) {
      const data = yield call(SearchByas, payload);
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

    *searchByrn({ payload }, { call, put }) {
      const data = yield call(SearchByrn, payload);
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

    *searchByte({ payload }, { call, put }) {
      const data = yield call(SearchByte, payload);
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

    *searchByplatform({ payload }, { call, put }) {
      const data = yield call(SearchByplatform, payload);
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

    *searchByts({ payload }, { call, put }) {
      const data = yield call(SearchByts, payload);
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

    *searchBylocation({ payload }, { call, put }) {
      const data = yield call(SearchBylocation, payload);
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

    *searchByct({ payload }, { call, put }) {
      const data = yield call(SearchByct, payload);
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

    *searchBydistance({ payload }, { call, put }) {
      const data = yield call(SearchBydistance, payload);
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

    *searchByspeed({ payload }, { call, put }) {
      const data = yield call(SearchByspeed, payload);
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

    *searchBywater({ payload }, { call, put }) {
      const data = yield call(SearchBywater, payload);
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

    *searchBypm({ payload }, { call, put }) {
      const data = yield call(SearchBypm, payload);
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

    *searchByam({ payload }, { call, put }) {
      const data = yield call(SearchByam, payload);
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
