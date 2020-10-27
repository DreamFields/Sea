import { Effect, Reducer } from 'umi';
import { message } from 'antd';
import {
    AddRnType,
    GetRnType,
    AddTeType,
    GetTeType,
    AddApType,
    GetApType,
    AddAsType,
    GetAsType,
    GetCountry,
    AddPowerEngine,
    GetPowerEngine,
    AddPropeller,
    GetPropeller,
    ModifyPulse,
    ModifyNoise,
    ModifyEcho
} from './service';

export interface StateType {
    //辐射噪声目标类别
    rnType?: any;     
    //目标回声类别       
    teType?: any;
    //主动脉冲目标类别
    apType?: any;
    //主动脉冲声呐类型
    asType?: any;
    //国别
    country?: any;
    //动力装置
    powerEngine?: any;
    //螺旋桨
    propeller?: any;
}

export interface ModelType {
    namespace: string;
    state: StateType;
    effects: {
        addRnType: Effect;
        getRnType: Effect;
        addTeType: Effect;
        getTeType: Effect;
        addApType: Effect;
        getApType: Effect;
        addAsType: Effect;
        getAsType: Effect;
        getCountry: Effect;
        addPowerEngine: Effect;
        getPowerEngine: Effect;
        addPropeller: Effect;
        getPropeller: Effect;
        modifyPulse: Effect;
        modifyNoise: Effect;
        modifyEcho: Effect
    };
    reducers: {
        save: Reducer<StateType>;
    };
}

const Model: ModelType = {
    namespace: 'inforImport',

    state: {
        rnType: undefined,
        teType: undefined,
        apType: undefined,
        asType: undefined,
        country: undefined,
        powerEngine: undefined,
        propeller: undefined,
    },

    effects: {
        *getRnType({ payload }, { call, put }) {
            const data = yield call(GetRnType, payload);
            if (data) {
                yield put({
                    type: 'save',
                    payload: {
                        rntype: data,
                    },
                });
            }
        },
        *addRnType({ payload }, { call, put }) {
            const data = yield call(AddRnType, payload);
            if (data) {
                message.success('添加辐射噪声目标类别成功！')
            } else {
                message.error('添加辐射噪声目标类别失败！');
            }
        },
        *getTeType({ payload }, { call, put }) {
            const data = yield call(GetTeType, payload);
            if (data) {
                yield put({
                    type: 'save',
                    payload: {
                        teType: data,
                    },
                });
            }
        },
        *addTeType({ payload }, { call, put }) {
            const data = yield call(AddTeType, payload);
            if (data) {
                message.success('添加目标回声类别成功！')
            } else {
                message.error('添加目标回声类别失败！');
            }
        },
        *getApType({ payload }, { call, put }) {
            const data = yield call(GetApType, payload);
            if (data) {
                yield put({
                    type: 'save',
                    payload: {
                        apType: data,
                    },
                });
            }
        },
        *addApType({ payload }, { call, put }) {
            const data = yield call(AddApType, payload);
            if (data) {
                message.success('添加主动脉冲目标类别成功！')
            } else {
                message.error('添加主动脉冲目标类别失败！');
            }
        },
        *getAsType({ payload }, { call, put }) {
            const data = yield call(GetAsType, payload);
            if (data) {
                yield put({
                    type: 'save',
                    payload: {
                        asType: data,
                    },
                });
            }
        },
        *addAsType({ payload }, { call, put }) {
            const data = yield call(AddAsType, payload);
            if (data) {
                message.success('添加主动脉冲声呐类型成功！')
            } else {
                message.error('添加主动脉冲声呐类型失败！');
            }
        },
        *getCountry({ payload }, {call, put }) {
            const data = yield call(GetCountry, payload);
            if (data) {
                yield put({
                    type: 'save',
                    payload: {
                        country: data,
                    }
                })
            }
        },
        *getPowerEngine({ payload }, { call, put }) {
            const data = yield call(GetPowerEngine, payload);
            if (data) {
                yield put({
                    type: 'save',
                    payload: {
                        powerEngine: data,
                    },
                });
            }
        },
        *addPowerEngine({ payload }, { call, put }) {
            const data = yield call(AddPowerEngine, payload);
            if (data) {
                message.success('添加动力装置成功！')
            } else {
                message.error('添加动力装置失败！');
            }
        },
        *getPropeller({ payload }, { call, put }) {
            const data = yield call(GetPropeller, payload);
            if (data) {
                yield put({
                    type: 'save',
                    payload: {
                        propeller: data,
                    },
                });
            }
        },
        *addPropeller({ payload }, { call, put }) {
            const data = yield call(AddPropeller, payload);
            if (data) {
                message.success('添加螺旋桨类别成功！')
            } else {
                message.error('添加螺旋桨类别失败！');
            }
        },
        *modifyPulse({ payload }, { call, put }) {
            const data = yield call(ModifyPulse, payload);
            if (data) {
                message.success('录入主动脉冲类型信息成功！')
            } else {
                message.error('录入主动脉冲类型失败！');
            }
        },
        *modifyNoise({ payload }, { call, put }) {
            const data = yield call(ModifyNoise, payload);
            if (data) {
                message.success('录入辐射噪声类型信息成功！')
            } else {
                message.error('录入辐射噪声类型信息失败！');
            }
        },
        *modifyEcho({ payload }, { call, put }) {
            const data = yield call(ModifyEcho, payload);
            if (data) {
                message.success('录入目标回声类型信息成功！')
            } else {
                message.error('录入目标回声类型信息失败！');
            }
        },
    },

    reducers: {
        save(state, { payload }) {
            return { ...state, ...payload };
        },
    },
};

export default Model;
