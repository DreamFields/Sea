const Model = {
  namespace: 'demonTable',

  state: {
    tabledata: [],
  },

  reducers: {
    setdata(state, { payload, callback }) {
      return callback(state);
    },
  },

  effects: {},
};

export default Model;
