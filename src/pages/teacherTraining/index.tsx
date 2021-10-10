import React, { useState } from 'react';
import { Tabs } from 'antd';
const { TabPane } = Tabs;
import style from './style.less';
import AddQuestion from './addQuestion';
import AddKnowledge from './addKnowledge';
import QuestionDetail from './questionDetail';
import StudentList from './studentList';
import UpdateQuestion from './updateQuestion';
import KnowledgeList from './knowledgeList';
import QuestionList from './questionList';

const NAVIGATION = [
  {
    text: '添加题目',
    component: AddQuestion,
  },
  {
    text: '增加知识点',
    component: AddKnowledge,
  },
  {
    text: '查看题目细节',
    component: QuestionDetail,
  },
  {
    text: '答题情况',
    component: StudentList,
  },
  {
    text: '修改题目',
    component: UpdateQuestion,
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
