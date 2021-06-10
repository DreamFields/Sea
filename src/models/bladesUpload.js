const Model = {
  namespace: 'bladesUpload',

  state: {
    blades: 0,
    shade: '',
  },

  reducers: {
    setdata(state, { payload, callback }) {
      return callback(state);
    },
  },

  effects: {},
};

export default Model;
