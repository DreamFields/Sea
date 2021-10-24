import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const { SubMenu } = Menu;
const { Sider } = Layout;

const Component = () => {
  const [cur, setCur] = useState('0');

  return (
    <Sider className="side" width={350}>
      <Menu
        onClick={(e) => console.log(e)}
        style={{ width: 350 }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
      >
        <SubMenu key="sub1" title="学生情况">
          <Menu.Item key="1">考核</Menu.Item>
          <Menu.Item key="2">考试</Menu.Item>
        </SubMenu>
        <SubMenu key="sub2" title="卷库管理">
          <Menu.Item key="3">试卷列表</Menu.Item>
          <Menu.Item key="4">新增试卷</Menu.Item>
        </SubMenu>
        <SubMenu key="sub3" title="题目管理">
          <Menu.Item key="5">题目列表</Menu.Item>
          <Menu.Item key="6">新增题目</Menu.Item>
        </SubMenu>
        <SubMenu key="sub4" title="知识点管理">
          <Menu.Item key="7">知识点列表</Menu.Item>
        </SubMenu>
      </Menu>
    </Sider>
  );
};

export default Component;
