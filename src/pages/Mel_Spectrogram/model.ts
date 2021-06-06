const Model = {
  namespace: 'MelTable',

  state: {
    tabledata1: [
      {
        key: '1',
        frequency: undefined,
        echo_width: undefined,
        echo_length: undefined,
      },
    ],
    tabledata2: [
      {
        key: '1',
        frequency: undefined,
        signal_type: undefined,
        pulse_cycle: undefined,
        pulse_width: undefined,
      },
    ],
  },

  reducers: {
    setdata(state, { payload, callback }) {
      return callback(state);
    },
  },

  effects: {},
};

export default Model;
