const Model = {
  namespace: 'basicSoundData',

  state: {},

  reducers: {
    setdata(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};

export default Model;
