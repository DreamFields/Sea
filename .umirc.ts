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
  publicPath: '/public/',
  history: { type: 'hash' },
  chainWebpack(memo) {
    memo.module
      .rule('media')
      .test(/\.(wav)$/)
      .use('file-loader')
      .loader(require.resolve('file-loader')),
    memo.module
      .rule('media')
      .test(/\.(mp4)$/)
      .use('file-loader')
      .loader(require.resolve('file-loader'))
  },
  dynamicImport: {},
  proxy: proxy[REACT_APP_ENV || 'dev'],
  // routes: [
  //   { path: '/', component: '@/pages/index' },
  // ],
});
