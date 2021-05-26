import BasicLayouts from './BasicLayout/BasicLayouts2';
import UserLayout from './UserLayouts.js';
import React from 'react';
import zhCN from 'antd/lib/locale/zh_CN';
import { ConfigProvider } from 'antd';

const index = (props) => {
  const { location } = props;
  const { pathname } = location;
  // console.log(pathname);
  if (pathname.search('/user') == -1) {
    return (
      <ConfigProvider locale={zhCN}>
        <BasicLayouts {...props} />
      </ConfigProvider>
    );
  } else if (pathname.search('/user') != -1) {
    return (
      <ConfigProvider locale={zhCN}>
        <UserLayout {...props} />
      </ConfigProvider>
    );
  }
};

export default index;
