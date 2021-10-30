import React from 'react';
import { Layout, Menu } from 'antd';
import { sidebarEventEmitter } from '../../models/eventBus';
import { history } from 'umi';

const { SubMenu } = Menu;
const { Sider } = Layout;

const Component = () => {
  const difficultMenu = (chapter_id: string) => {
    const c: any[] = [];
    for (let i = 1; i <= 10; i++) {
      c.push(
        <Menu.Item key={`chapter_id${chapter_id}_difficult${i}`}>
          难度{i}
        </Menu.Item>,
      );
    }
    return (
      <SubMenu key={`chapter_id${chapter_id}`} title={`章节${chapter_id}`}>
        {c}
      </SubMenu>
    );
  };
  const d: any[] = [];
  for (let i = 1; i <= 10; i++) {
    d.push(i);
  }

  return (
    <Sider className="side" width={350}>
      <Menu
        onClick={(e) => {
          if (e.key.startsWith('chapter_id')) {
            const r = /^chapter_id(\d+)_difficult(\d+)$/;
            const { 1: chapter, 2: difficult } = r.exec(e.key)!;
            history.push(`/teacherTraining/${chapter}/${difficult}`);
          } else {
            sidebarEventEmitter.emit('change', e.key);
          }
        }}
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
          {d.map((item) => difficultMenu(item))}
        </SubMenu>
        <SubMenu key="sub4" title="知识点管理">
          <Menu.Item key="4">知识点列表</Menu.Item>
          <Menu.Item key="5">添加知识点</Menu.Item>
        </SubMenu>
        <SubMenu key="sub5" title="DEBUG">
          <Menu.Item key="6">试卷题目列表</Menu.Item>
          <Menu.Item key="7">试卷选题</Menu.Item>
        </SubMenu>
      </Menu>
    </Sider>
  );
};

export default Component;
