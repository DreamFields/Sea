import React, { useState } from 'react';
import { Tabs } from 'antd';
const { TabPane } = Tabs;
import style from './style.less';
import StudentList from './studentList';
import KnowledgeList from './knowledgeList';
import QuestionList from './questionList';

const NAVIGATION = [
  {
    text: '答题情况',
    component: StudentList,
  },
  {
    text: '知识点列表',
    component: KnowledgeList,
  },
  {
    text: '题目列表',
    component: QuestionList,
  },
];

const Index = (props: any) => {
  return (
    <Tabs defaultActiveKey="0">
      {NAVIGATION.map((item, idx) => {
        const Component = item.component;
        return (
          <TabPane tab={item.text} key={idx.toString()}>
            <Component />
          </TabPane>
        );
      })}
    </Tabs>
  );
};

export default Index;
