const Model = {
  namespace: 'power',

  state: {
    y_data: [],
    x_data: [],
    ot_x_data: [],
    ot_y_data: [],
    label: 0,
  },

  reducers: {
    setdata(state, { payload }) {
      return { ...state, ...payload };
    },
  },

  effects: {},
};

export default Model;
