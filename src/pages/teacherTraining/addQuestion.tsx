import React, { useState } from 'react';
import style from './style.less';
import QuestionComponent from './questionComponent';
import { Button } from 'antd';

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

  const submit = () => {
    const postData = {
      ...data,
      difficult: +data.difficult,
      knowledge_id: +data.knowledge_id,
    };
    console.log(postData);
  };
  return (
    <div>
      <QuestionComponent data={data} setData={setData} readOnly={false} />
      <Button onClick={submit}>提交</Button>
    </div>
  );
};

export default Component;
