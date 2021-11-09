import React from 'react';
import { Layout, Menu } from 'antd';
import { history } from 'umi';

const { SubMenu } = Menu;
const { Sider } = Layout;

const NAVIGATION = [
  '/',
  '/listenTraining/ParticipatedExam',
  '/listenTraining/UnparticipatedExam',
];

const Component = () => {
  const d: any[] = [];
  for (let i = 1; i <= 10; i++) {
    d.push(i);
  }

  return (
    <Sider className="side" width={350}>
      <Menu
        onClick={(e) => {
          history.push(NAVIGATION[e.key]);
        }}
        style={{ width: 350 }}
        defaultSelectedKeys={['0']}
        defaultOpenKeys={['sub1']}
        mode="inline"
      >
        <SubMenu key="sub1" title="训练">
          {d.map((chapter_id) => {
            return (
              <Menu.Item
                key={`chapter_id${chapter_id}`}
              >{`章节${chapter_id}`}</Menu.Item>
            );
          })}
        </SubMenu>
        <SubMenu key="sub2" title="考核">
          <Menu.Item key="1">已参加</Menu.Item>
          <Menu.Item key="2">未参加</Menu.Item>
        </SubMenu>
      </Menu>
    </Sider>
  );
};

export default Component;
