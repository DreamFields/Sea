import { Effect, Reducer } from 'umi';
export interface StateType {
  data: any;
  all_x_data: any;
  all_y_data: any;
  all_max_value: any;
  all_min_value: any;
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
  namespace: 'demon_analysis2',
  state: {
    // 所有纵坐标数据
    data: [],
    // 所有横坐标数据
    all_x_data: [],
    //所有纵坐标数据
    all_y_data: [],
    //所有最大值数据
    all_max_value: [],
    //所有最小值数据
    all_min_value: [],
    // 当前帧
    label: -2,
  },
  reducers: {
    savedata(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};

export default Model;
