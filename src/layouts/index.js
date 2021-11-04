import BasicLayouts from './BasicLayout/BasicLayouts';
import UserLayout from './UserLayouts.js';
import React from 'react';
import zhCN from 'antd/lib/locale/zh_CN';
import { ConfigProvider } from 'antd';
import CookieUtil from '../utils/cookie';

const index = (props) => {
  const { location } = props;
  const { pathname } = location;

  // console.log(pathname);
  if (
    pathname.search('listenTraining') !== -1 ||
    pathname.search('teacherTraining') !== -1
  ) {
    const roles = ['管理员', '教员', '学员'];
    const role = CookieUtil.get('role')
      ? roles[CookieUtil.get('role') - 1]
      : 'null';
    return (
      <ConfigProvider locale={zhCN}>
        <BasicLayouts {...props} train={role === '教员'} />
      </ConfigProvider>
    );
  }

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
