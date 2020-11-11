/*
 * @Descripttion :
 * @Author       : HuRenbin
 * @LastEditors  : HuRenbin
 * @Date         : 2020-10-27 08:25:16
 * @LastEditTime : 2020-11-11 22:33:22
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

//mock: 'http://39.96.191.139:3000/mock/18',

export default {
  dev: {
    '/sea': {
      target: 'http://47.97.152.219/api',
      changeOrigin: true,
      pathRewrite: {
        '^/sea': '',
      },
    },
    '/api': {
      target: 'http://47.97.152.219',
      // target: 'http://127.0.0.1:5000',
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
