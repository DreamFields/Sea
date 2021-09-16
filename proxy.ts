/*
 * @Descripttion :
 * @Author       : HuRenbin
 * @LastEditors  : HuRenbin
 * @Date         : 2020-10-27 08:25:16
 * @LastEditTime : 2020-11-11 22:50:47
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
