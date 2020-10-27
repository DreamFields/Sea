import { Login } from './service'
import CookieUtil from '@/utils/cookie.js'
import { message } from 'antd'

const Model = {
  namespace: 'login',

  state: { tokens: { 1: {}, 2: {} } },

  reducers: {
    add_tokens(state, { payload }) {
      return { ...state, tokens: { ...state.tokens, ...payload } }
    },
    clear_tokens(state) {
      return { ...state, tokens: { 1: {}, 2: {} } }
    }
  },

  effects: {
    *login({ payload }, { call }) {
      // console.log('logindata', payload);
      const data = yield call(Login, payload)

      if (data) {
        const { token, userInfo } = data
        // token 过期时间45分钟
        const expires = new Date(+new Date() + 45 * 60 * 1000)

        CookieUtil.set('token', token, expires, '/')
        CookieUtil.set('userInfo', JSON.stringify(userInfo), new Date(+new Date() + 24 * 60 * 60 * 1000))
        message.success('登录成功！');
        // CookieUtil.set(
        //   'ALTER_can_export',
        //   JSON.stringify(ALTER_can_export),
        //   new Date(+new Date() + 24 * 60 * 60 * 1000)
        // )
        return true
      }
      return false
    },
    *login_project({ payload }, { call, put }) {
      const data = yield call(Login, payload)

      if (data) {
        const { tokenInfo, userInfo } = data
        // token 过期时间24小时
        if (tokenInfo === undefined) {
          // message.error('该用户未关联此系统!')
          return
        }

        for (const tokens of tokenInfo) {
          const expires = new Date(+new Date() + 24 * 60 * 60 * 1000)
          if (tokens.tokens.length !== 0) {
            // console.log('tokens.tokens[0]', tokens.tokens[0])
            CookieUtil.set('token', tokens.tokens[0].token, expires, '/')
          }
          const token_map = {}
          // console.log('tokens', tokens)
          for (const _token of tokens.tokens) {
            token_map[_token.project_id] = _token.token
            CookieUtil.set('token_' + _token.project_id, _token.token, expires, '/')
          }

          // yield put({
          //   type: 'add_tokens',
          //   payload: {
          //     [tokens.system_id]: token_map
          //   }
          // })
        }

        CookieUtil.set('userInfo', JSON.stringify(userInfo), new Date(+new Date() + 24 * 60 * 60 * 1000))
        // CookieUtil.set(
        //   'ALTER_can_export',
        //   JSON.stringify(ALTER_can_export),
        //   new Date(+new Date() + 24 * 60 * 60 * 1000)
        // )
        return true
      }
      return false
    }
  }
}

export default Model
