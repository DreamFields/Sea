import React, { useState, useEffect } from 'react';
import style from './style.less';

import StudentKaohe from './StudentKaohe';
import StudentKaoshi from './StudentKaoshi';
import PaperAdd from './PaperAdd';
import PaperList from './PaperList';
import QuestionList from './questionList';
import AddQuestion from './addQuestion';
import KnowledgeList from './knowledgeList';
import AddKnowledge from './addKnowledge';
import PaperQuestionList from './PaperQuestionList';
import NewQuestionForPaper from './NewQuestionForPaper';

import { sidebarEventEmitter } from '../../models/eventBus';

const NAVIGATION = [
  StudentKaohe,
  StudentKaoshi,
  PaperList,
  PaperAdd,
  QuestionList,
  KnowledgeList,
  AddKnowledge,

  // Debug
  PaperQuestionList,
  NewQuestionForPaper,
];

const Index = (props: any) => {
  const [cur, setCur] = useState(0);
  useEffect(() => {
    const handler = (e: any) => {
      console.log('on change', e);
      setCur(+e);
    };

    sidebarEventEmitter.on('change', handler);
    return () => {
      sidebarEventEmitter.off('change', handler);
    };
  });

  const Component = NAVIGATION[cur];
  return <Component />;
};

export default Index;
