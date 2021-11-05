import React, { useState } from 'react';
import style from './style.less';
import QuestionComponent from './questionComponent';
import { Button, message } from 'antd';
import { post } from '@/utils/request';

const Component = (props: any) => {
  const { onDone, chapter, difficult } = props;
  console.log('add question component', chapter, difficult);

  const [data, setData] = useState({
    difficult,
    chapter,
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
    question_id: '',
  });

  const submit = async () => {
    const postData: any = {
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
      chapter: +data.chapter,
    };

    if (data.question_id) {
      postData.id = data.question_id;
    }

    console.log(data.question_id);
    const res = await post<any>(
      data.question_id
        ? '/v1/teacher/update_question'
        : '/v1/teacher/add_question',
      {
        data: postData,
      },
    );
    console.log('add_question', res);
    message.success('添加成功');
    onDone && onDone();
  };

  return (
    <div>
      <QuestionComponent data={data} onDataChange={setData} readOnly={false} />
      <Button onClick={submit}>提交</Button>
    </div>
  );
};

export default Component;
