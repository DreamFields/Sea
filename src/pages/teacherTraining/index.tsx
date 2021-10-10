import React, { useState } from 'react';
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
  const [currentPage, setCurrentPage] = useState(0);
  const Component = NAVIGATION[currentPage].component;

  return (
    <div>
      {NAVIGATION.map((item, idx) => {
        return (
          <button
            style={{ color: idx === currentPage ? 'red' : 'black' }}
            onClick={() => setCurrentPage(idx)}
            key={item.text}
          >
            {item.text}
          </button>
        );
      })}
      <div>
        <Component />
      </div>
    </div>
  );
};

export default Index;
