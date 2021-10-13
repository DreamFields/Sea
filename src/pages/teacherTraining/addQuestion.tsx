import React, { useState } from 'react';
import style from './style.less';
import QuestionComponent from './questionComponent';
import { Button, message } from 'antd';
import { post } from '@/utils/request';

const Component = (props: any) => {
  const [data, setData] = useState({
    difficult: '1',
    correct: 'A',
    info_text_content: {
      question_info: '',
      A: '',
      B: '',
      C: '',
      D: '',
    },
    analysis: '',
    knowledge_id: '',
  });

  const submit = async () => {
    const postData = {
      difficult: +data.difficult,
      knowledge_id: +data.knowledge_id ?? 1,
      correct: data.correct,
      info_text_content: {
        question_info: data.info_text_content.question_info,
        A: data.info_text_content.A.toString(),
        B: data.info_text_content.B.toString(),
        C: data.info_text_content.C.toString(),
        D: data.info_text_content.D.toString(),
      },
      analysis: data.analysis,
    };

    const res = await post<any>('/v1/teacher/add_question', {
      data: postData,
    });
    console.log('add_question', res);
    message.success('添加成功');
  };
  return (
    <div>
      <QuestionComponent data={data} onDataChange={setData} readOnly={false} />
      <Button onClick={submit}>提交</Button>
    </div>
  );
};

export default Component;
