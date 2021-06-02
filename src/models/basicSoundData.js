const Model = {
  namespace: 'basicSoundData',

  state: {
    db: 0,
    hz: 0,
    calc: 0,
    mean: 0,
    va: 0,
    sc: 0,
    scw: 0,
    sa: 0,
    ss: 0,
    sd: 0,
    si: 0,
    su: 0,
    se: 0,
    label: 0,
    rpm: 0,

    // 轴数
    axle: 0,
  },

  reducers: {
    setdata(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};

export default Model;
