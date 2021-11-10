import { Row, Col, Layout, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from '@@/plugin-dva/exports';
const { SubMenu } = Menu;
import { history, useLocation } from 'umi';
const { Sider } = Layout;

// const chooseArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const NAVIGATION = {
  done: '/studentTraining/PaperDone',
  canDo: '/studentTraining/PaperCanDo',
};

const StuQuestionSider = (props) => {
  const { difficultList, dispatch } = props;
  const [curMenu, setCurMenu] = useState('');

  const location = useLocation();
  // 去除'difficult'前缀
  // const arr = Object.keys(difficultList).map((diff) => parseInt(diff.slice(9)));
  // console.log('arr', arr);

  const difficultMenu = (chapter_id: string) => {
    const c: any[] = [];
    for (let i = 1; i <= 10; i++) {
      c.push(
        <Menu.Item
          style={{ fontSize: 15 }}
          key={`chapter_id${chapter_id}_difficult${i}`}
          title={`章节${chapter_id}`}
          disabled={i > difficultList[`difficult${chapter_id}`]}
        >
          难度{i}
        </Menu.Item>,
      );
    }
    return (
      <SubMenu
        style={{ fontSize: 20 }}
        key={`chapter_id${chapter_id}`}
        title={`章节${chapter_id}`}
        disabled={!difficultList[`difficult${chapter_id}`]}
      >
        {c}
      </SubMenu>
    );
  };

  const d: any[] = [];
  for (let i = 1; i <= 10; i++) {
    d.push(i);
  }

  useEffect(() => {
    dispatch({
      type: 'listenTraining/getDiffcultList',
    });
  }, []);

  useEffect(() => {
    console.log('location', location);
    const r = /^\/studentTraining\/(\d+)\/(\d+)$/;
    const res = r.exec(location.pathname);
    console.log('r.exec(location.pathname)', r.exec(location.pathname));
    if (res) {
      const { 1: chapter, 2: difficult } = r.exec(location.pathname)!;
      console.log('chapter', chapter);
      console.log('difficult', difficult);
      if (chapter && difficult)
        setCurMenu(`chapter_id${chapter}_difficult${difficult}`);
    }
  }, [location]);

  return (
    <Sider className="side" width={350}>
      <Menu
        style={{ width: 350, fontSize: 30 }}
        defaultOpenKeys={['sub1']}
        mode="inline"
        onClick={(e) => {
          // console.log('点击菜单项', e);
          // setcurMenu(e.key);
          if (e.key.startsWith('chapter_id')) {
            const r = /^chapter_id(\d+)_difficult(\d+)$/;
            const { 1: chapter, 2: difficult } = r.exec(e.key)!;
            history.push(`/studentTraining/${chapter}/${difficult}`);
          } else {
            history.push(NAVIGATION[e.key]);
          }
          setCurMenu(e.key);
        }}
        selectedKeys={[curMenu]}
      >
        <SubMenu key="sub1" title="训练">
          {d.map((item) => difficultMenu(item))}
        </SubMenu>

        <SubMenu key="sub2" title="考核">
          <Menu.Item style={{ fontSize: 20 }} key="done">
            已经参加的考核
          </Menu.Item>
          <Menu.Item style={{ fontSize: 20 }} key="canDo">
            可以参加的考核
          </Menu.Item>
        </SubMenu>
      </Menu>
    </Sider>
  );
};

const mapStateToProps = ({ listenTraining }) => {
  return {
    difficultList: listenTraining.difficultList,
    // questionList: listenTraining.questionList,
  };
};

export default connect(mapStateToProps)(StuQuestionSider);
