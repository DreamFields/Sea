import { Effect, Reducer } from 'umi';
export interface StateType {
  data: any;
  all_x_data: any;
  label: any;
}
export interface ModelType {
  namespace: string;
  state: StateType;
  reducers: {
    savedata: Reducer<StateType>;
  };
}
const Model: ModelType = {
  namespace: 'Zero_crossing',
  state: {
    // 所有纵坐标数据
    data: [],
    // 所有横坐标数据
    all_x_data: [],
    // 当前帧
    label: 0,
  },
  reducers: {
    savedata(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};

export default Model;
