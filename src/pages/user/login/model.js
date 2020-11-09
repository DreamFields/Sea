import { Login } from './service';
import CookieUtil from '@/utils/cookie.js';
import { message } from 'antd';

const Model = {
  namespace: 'login',

  state: { tokens: { 1: {}, 2: {} } },

  reducers: {
    add_tokens(state, { payload }) {
      return { ...state, tokens: { ...state.tokens, ...payload } };
    },
    clear_tokens(state) {
      return { ...state, tokens: { 1: {}, 2: {} } };
    },
  },

  effects: {
    *login({ payload }, { call }) {
      // console.log('logindata', payload);
      const data = yield call(Login, payload);

      if (data) {
        const { token, userInfo } = data;
        // token 过期时间24小时
        const expires = new Date(+new Date() + 24 * 60 * 60 * 1000);

        CookieUtil.set('token', token, expires, '/');
        // CookieUtil.set('userInfo', JSON.stringify(userInfo), new Date(+new Date() + 24 * 60 * 60 * 1000))
        message.success('登录成功！');
        return true;
      }
      return false;
    },
  },
};

export default Model;
