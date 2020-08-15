import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
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
      .loader(require.resolve('file-loader'))
  }
  // routes: [
  //   { path: '/', component: '@/pages/index' },
  // ],
});
