import { Effect, Reducer } from 'umi';
export interface StateType {
  data: any;
  all_x_data: any;
  label: any;
  frame_num: any;
}
export interface ModelType {
  namespace: string;
  state: StateType;
  reducers: {
    savedata: Reducer<StateType>;
    setAllXData: Reducer<StateType>;
    savelabel: Reducer<StateType>;
    saveframe_num: Reducer<StateType>;
  };
}
const Model: ModelType = {
  namespace: 'Zero_crossing',
  state: {
    data: [],
    all_x_data: [],
    label: 0,
    frame_num: 0,
  },
  reducers: {
    savedata(state, { payload }) {
      // let newState = JSON.parse(JSON.stringify(state))
      // newState.data = data;
      // return newState;
      return { ...state, ...payload };
    },
    setAllXData(state, { payload }) {
      return { ...state, ...payload };
    },
    savelabel(state, { payload }) {
      return { ...state, ...payload };
    },
    saveframe_num(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};

export default Model;
