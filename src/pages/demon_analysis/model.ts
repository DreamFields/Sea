import { Effect, Reducer } from 'umi';
import { message } from 'antd';
export interface StateType {
  dataL: any;
  data: any;
  dynamicData: any;
}
export interface ModelType {
  namespace: string;
  state: StateType;
  reducers: {
    savedataL: Reducer<StateType>;
    savedata: Reducer<StateType>;
    savedynamicData: Reducer<StateType>;
  };
}
const Model: ModelType = {
  namespace: 'data_demon',
  state: {
    dataL: 0,
    data: [],
    dynamicData: [],
  },
  reducers: {
    savedataL(state, { payload }) {
      // let newState = JSON.parse(JSON.stringify(state))
      // newState.dataL = dataL;
      return { ...state, ...payload };
    },
    savedata(state, { payload }) {
      // let newState = JSON.parse(JSON.stringify(state))
      // newState.data = data;
      // return newState;
      return { ...state, ...payload };
    },
    savedynamicData(state, { payload }) {
      // let newState = JSON.parse(JSON.stringify(state))
      // newState.dynamicData = dynamicData;
      // return newState;
      return { ...state, ...payload };
    },
  },
};

export default Model;
