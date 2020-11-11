/*
 * @Descripttion :
 * @Author       : HuRenbin
 * @LastEditors  : HuRenbin
 * @Date         : 2020-11-02 23:02:28
 * @LastEditTime : 2020-11-11 19:06:08
 * @github       : https://github.com/HlgdB/Seadata
 * @FilePath     : \Seadata-front\src\pages\audioEdit\model.ts
 */
import { Effect, Reducer } from 'umi';
import { message } from 'antd';
import {
  EditAudio,
  GetDuplicateUrl,
  SaveAudio,
  GetVersions,
  RollBack,
  Reset,
  GetTips,
  SaveTips,
} from './service';

export interface StateType {
  audio_id: any;
  audio_name: any;
  audio_versions: any;
  tips: any;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    setAudio: Effect;
    editAudio: Effect;
    saveAudio: Effect;
    getVersions: Effect;
    rollBack: Effect;
    reset: Effect;
    getDuplicateUrl: Effect;
    getTips: Effect;
    saveTips: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'pretreatment',

  state: {
    audio_id: undefined,
    audio_name: undefined,
    audio_versions: undefined,
    tips: undefined,
  },

  effects: {
    *setAudio({ payload }, { call, put }) {
      // console.log(payload);
      if (payload) {
        yield put({
          type: 'save',
          payload: payload,
        });
      }
    },
    *editAudio({ payload }, { call, put }) {
      const data = yield call(EditAudio, payload);
      if (data) {
        message.success('编辑音频成功');
      }
    },
    *saveAudio({ payload }, { call, put }) {
      const data = yield call(SaveAudio, payload);
      if (data) {
        message.success('保存成功');
        yield put({
          type: 'getVersions',
          payload: payload.audio_id,
        });
      } else {
        message.error('保存失败！');
      }
    },
    *getVersions({ payload }, { call, put }) {
      const data = yield call(GetVersions, payload);
      if (data) {
        // console.log("版本记录", data);
        let versions = [];
        if (data) {
          for (let i = data.length - 1; i >= 0; i--) {
            if (data[i].version !== -1) {
              versions.push(data[i]);
            }
          }
        }
        yield put({
          type: 'save',
          payload: { audio_versions: versions },
        });
      }
    },
    *rollBack({ payload }, { call, put }) {
      const data = yield call(RollBack, payload);
      if (data) {
        message.success('回滚成功！');
      } else {
        message.error('回滚失败！');
      }
    },
    *reset({ payload }, { call, put }) {
      const data = yield call(Reset, payload);
      if (data) {
        message.success('重置成功！');
      } else {
        message.error('重置失败！');
      }
    },
    *getDuplicateUrl({ payload }, { call, put }) {
      const data = yield call(GetDuplicateUrl, payload);
      if (data) {
        // message.success('编辑音频成功');
        // console.log("副本url", data)
      }
    },
    *getTips({ payload }, { call, put }) {
      const data = yield call(GetTips, payload);
      if (data) {
        yield put({
          type: 'save',
          payload: { tips: data },
        });
      }
    },
    *saveTips({ payload }, { call, put }) {
      const data = yield call(SaveTips, payload);
      if (data) {
        message.success('保存标签成功！');
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
