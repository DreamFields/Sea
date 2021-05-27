import { Effect, Reducer } from 'umi';
export interface StateType {
  ydata: any;
  label: number;
  xdata: any;
}
export interface ModelType {
  namespace: string;
  state: StateType;
  reducers: {
    savedata: Reducer<StateType>;
  };
}
const Model: ModelType = {
  namespace: 'data_demon',
  state: {
    ydata: [],
    xdata: [],
    label: 0,
  },
  reducers: {
    savedata(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};

export default Model;
