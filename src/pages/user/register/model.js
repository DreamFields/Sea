/*
 * @Descripttion :
 * @Author       : HuRenbin
 * @LastEditors  : HuRenbin
 * @Date         : 2020-10-27 09:27:34
 * @LastEditTime : 2020-11-14 17:12:51
 * @github       : https://github.com/HlgdB/Seadata
 * @FilePath     : \Seadata-front\src\pages\user\register\model.js
 */
import { Register } from './service';
import CookieUtil from '@/utils/cookie.js';
import { message } from 'antd';

const Model = {
  namespace: 'register',

  state: {},

  reducers: {},

  effects: {
    *register({ payload }, { call }) {
      // console.log('logindata', payload);
      const data = yield call(Register, payload);

      if (data) {
        console.log(data);
        message.success('注册成功！');
        return true;
      }
      return false;
    },
  },
};

export default Model;
