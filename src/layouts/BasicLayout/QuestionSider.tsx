import React from 'react';
import { Layout, Menu } from 'antd';
import { sidebarEventEmitter } from '../../models/eventBus';

const { SubMenu } = Menu;
const { Sider } = Layout;

const Component = () => {
  return (
    <Sider className="side" width={350}>
      <Menu
        onClick={(e) => sidebarEventEmitter.emit('change', e.key)}
        style={{ width: 350 }}
        defaultSelectedKeys={['0']}
        defaultOpenKeys={['sub1']}
        mode="inline"
      >
        <SubMenu key="sub1" title="学生情况">
          <Menu.Item key="0">考核</Menu.Item>
          <Menu.Item key="1">考试</Menu.Item>
        </SubMenu>
        <SubMenu key="sub2" title="卷库管理">
          <Menu.Item key="2">试卷列表</Menu.Item>
          <Menu.Item key="3">新增试卷</Menu.Item>
        </SubMenu>
        <SubMenu key="sub3" title="题目管理">
          <Menu.Item key="4">题目列表</Menu.Item>
          <Menu.Item key="5">新增题目</Menu.Item>
        </SubMenu>
        <SubMenu key="sub4" title="知识点管理">
          <Menu.Item key="6">知识点列表</Menu.Item>
          <Menu.Item key="7">添加知识点</Menu.Item>
        </SubMenu>
        <SubMenu key="sub5" title="DEBUG">
          <Menu.Item key="8">试卷题目列表</Menu.Item>
        </SubMenu>
      </Menu>
    </Sider>
  );
};

export default Component;
