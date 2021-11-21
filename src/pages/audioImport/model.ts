import { Effect, Reducer, Subscription } from 'umi';
import { message } from 'antd';
import {
  AddRnType,
  GetRnType,
  DelRnType,
  AddTeType,
  GetTeType,
  AddApType,
  GetApType,
  AddAsType,
  GetAsType,
  GetCountry,
  AddPowerEngine,
  GetPowerEngine,
  AddPropeller,
  GetPropeller,
  ModifyPulse,
  ModifyNoise,
  ModifyEcho,
  SearchSound,
} from './service';

export interface StateType {
  //辐射噪声目标类别
  rnType?: any;
  //目标回声类别
  teType?: any;
  //主动脉冲目标类别
  apType?: any;
  //主动脉冲声呐类型
  asType?: any;
  //国别
  country?: any;
  //动力装置
  powerEngine?: any;
  //螺旋桨
  propeller?: any;
  //搜索到的信息
  searchInfor?: any;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    addRnType: Effect;
    getRnType: Effect;
    delRnType: Effect;
    addTeType: Effect;
    getTeType: Effect;
    addApType: Effect;
    getApType: Effect;
    addAsType: Effect;
    getAsType: Effect;
    getCountry: Effect;
    addPowerEngine: Effect;
    getPowerEngine: Effect;
    addPropeller: Effect;
    getPropeller: Effect;
    modifyPulse: Effect;
    modifyNoise: Effect;
    modifyEcho: Effect;
    searchSound: Effect;
    setInfor: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const Model: ModelType = {
  namespace: 'inforImport',

  state: {
    rnType: undefined,
    teType: undefined,
    apType: undefined,
    asType: undefined,
    country: undefined,
    powerEngine: undefined,
    propeller: undefined,
    searchInfor: undefined,
  },

  effects: {
    *getRnType({ payload }, { call, put }) {
      const data = yield call(GetRnType, payload);
      if (data) {
        yield put({
          type: 'save',
          payload: {
            rnType: data,
          },
        });
      }
    },
    *addRnType({ payload }, { call, put }) {
      const data = yield call(AddRnType, payload);
      if (data) {
        message.success('添加辐射噪声目标类别成功！');
        yield put({
          type: 'getRnType',
          payload: {},
        });
      } else {
        message.error('添加辐射噪声目标类别失败！');
      }
    },
    *delRnType({ payload }, { call, put }) {
      console.log(payload);
      const data = yield call(DelRnType, payload.name);
      if (data) {
        message.success('删除辐射噪声目标类别成功！');
      } else {
        message.error('删除辐射噪声目标类别失败！');
      }
      /*
      const data = yield call(deleteRecord, { id });
      if (data) {
        message.success('Delete successfully.');
        const { page, per_page } = yield select(
          (state: any) => state.users.meta,
        );
        yield put({
          type: 'getRemote',
          payload: {
            page,
            per_page,
          },
        });
      } else {
        message.error('Delete failed.');
      }*/
    },
    *getTeType({ payload }, { call, put }) {
      const data = yield call(GetTeType, payload);
      if (data) {
        yield put({
          type: 'save',
          payload: {
            teType: data,
          },
        });
      }
    },
    *addTeType({ payload }, { call, put }) {
      const data = yield call(AddTeType, payload);
      if (data) {
        yield put({
          type: 'getTeType',
          payload: {},
        });
        message.success('添加目标回声类别成功！');
      } else {
        message.error('添加目标回声类别失败！');
      }
    },
    *getApType({ payload }, { call, put }) {
      const data = yield call(GetApType, payload);
      if (data) {
        yield put({
          type: 'save',
          payload: {
            apType: data,
          },
        });
      }
    },
    *addApType({ payload }, { call, put }) {
      const data = yield call(AddApType, payload);
      if (data) {
        yield put({
          type: 'getApType',
          payload: {},
        });
        message.success('添加主动脉冲目标类别成功！');
      } else {
        message.error('添加主动脉冲目标类别失败！');
      }
    },
    *getAsType({ payload }, { call, put }) {
      const data = yield call(GetAsType, payload);
      if (data) {
        yield put({
          type: 'save',
          payload: {
            asType: data,
          },
        });
      }
    },
    *addAsType({ payload }, { call, put }) {
      const data = yield call(AddAsType, payload);
      if (data) {
        message.success('添加主动脉冲声呐类型成功！');
        yield put({
          type: 'getAsType',
          payload: {},
        });
      } else {
        message.error('添加主动脉冲声呐类型失败！');
      }
    },
    *getCountry({ payload }, { call, put }) {
      const data = yield call(GetCountry, payload);
      if (data) {
        yield put({
          type: 'save',
          payload: {
            country: data,
          },
        });
      }
    },
    *getPowerEngine({ payload }, { call, put }) {
      const data = yield call(GetPowerEngine, payload);
      if (data) {
        yield put({
          type: 'save',
          payload: {
            powerEngine: data,
          },
        });
      }
    },
    *addPowerEngine({ payload }, { call, put }) {
      const data = yield call(AddPowerEngine, payload);
      if (data) {
        message.success('添加动力装置成功！');
        yield put({
          type: 'getPowerEngine',
          payload: {},
        });
      } else {
        message.error('添加动力装置失败！');
      }
    },
    *getPropeller({ payload }, { call, put }) {
      const data = yield call(GetPropeller, payload);
      if (data) {
        yield put({
          type: 'save',
          payload: {
            propeller: data,
          },
        });
      }
    },
    *addPropeller({ payload }, { call, put }) {
      const data = yield call(AddPropeller, payload);
      if (data) {
        message.success('添加螺旋桨类别成功！');
        yield put({
          type: 'getPropeller',
          payload: {},
        });
      } else {
        message.error('添加螺旋桨类别失败！');
      }
    },
    *modifyPulse({ payload }, { call, put }) {
      const data = yield call(ModifyPulse, payload);
      if (data) {
        message.success('录入主动脉冲类型信息成功！');
      } else {
        message.error('录入主动脉冲类型失败！');
      }
    },
    *modifyNoise({ payload }, { call, put }) {
      const data = yield call(ModifyNoise, payload);
      if (data) {
        message.success('录入辐射噪声类型信息成功！');
      } else {
        message.error('录入辐射噪声类型信息失败！');
      }
    },
    *modifyEcho({ payload }, { call, put }) {
      const data = yield call(ModifyEcho, payload);
      if (data) {
        message.success('录入目标回声类型信息成功！');
      } else {
        message.error('录入目标回声类型信息失败！');
      }
    },
    *searchSound({ payload }, { call, put }) {
      const data = yield call(SearchSound, payload);
      if (data) {
        console.log(data);
        yield put({
          type: 'save',
          payload: {
            searchInfor: data,
          },
        });
        message.success('搜索成功！');
      } else {
        message.error('搜索失败！');
      }
    },
    *setInfor({ payload }, { call, put }) {
      if (payload) {
        console.log(payload);
        yield put({
          type: 'save',
          payload: {
            searchInfor: payload,
          },
        });
      } else {
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
      history.listen(({ pathname }) => {
        if (pathname !== '/user/login' && pathname !== '/user/register') {
          dispatch({
            type: 'getRnType',
          });
          dispatch({
            type: 'getTeType',
          });
          dispatch({
            type: 'getApType',
          });
          dispatch({
            type: 'getAsType',
          });
          dispatch({
            type: 'getCountry',
          });
          dispatch({
            type: 'getPowerEngine',
          });
          dispatch({
            type: 'getPowerEngine',
          });
          dispatch({
            type: 'getPropeller',
          });
        }
      });
    },
  },
};

export default Model;
