/*
 * @Descripttion :
 * @Author       : HuRenbin
 * @LastEditors  : HuRenbin
 * @Date         : 2020-10-26 15:36:09
 * @LastEditTime : 2020-11-07 11:08:09
 * @github       : https://github.com/HlgdB/Seadata
 * @FilePath     : \Seadata-front\.umirc.ts
 */
import { defineConfig } from 'umi';
import proxy from './proxy';

// process.env包含着关于系统环境的信息
const { REACT_APP_ENV } = process.env;

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  theme: {
    'primary-color': '#08979c',
  },
  antd: {
    dark: true, // 开启暗色主题
    // compact: true, // 开启紧凑主题
  },
  publicPath: './',
  history: { type: 'hash' },
  hash: true,
  chainWebpack(memo) {
    memo.module
      .rule('media')
      .test(/\.(wav|mp4)$/)
      .use('file-loader')
      .loader(require.resolve('file-loader'));
  },
  dynamicImport: {},
  dva: {},
  proxy: proxy[REACT_APP_ENV || 'dev'],
  // routes: [
  //   { path: '/', component: '@/pages/index' },
  // ],
  title: '水声数据库系统',
});
