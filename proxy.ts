/*
 * @Descripttion :
 * @Author       : HuRenbin
 * @LastEditors: Please set LastEditors
 * @Date         : 2020-10-27 08:25:16
 * @LastEditTime: 2021-10-27 14:19:36
 * @github       : https://github.com/HlgdB/Seadata
 * @FilePath     : \Seadata-front\proxy.ts
 */
/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
import { SERVICEURL } from './src/utils/const';
export default {
  dev: {
    '/sea': {
      target: `${SERVICEURL}/api`,
      changeOrigin: true,
      pathRewrite: {
        '^/sea': '',
      },
    },
    '/api': {
      target: SERVICEURL,
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
      secure: false, //umi代理https时应该设置secure属性
    },
  },
  test: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
