import React, { useState } from 'react';
import style from './style.less';
import QuestionComponent from './questionComponent';
import { Button, Input, message } from 'antd';
import { post } from '@/utils/request';

const Component = (props: any) => {
  const [data, setData] = useState<any>(null);
  const [id, setId] = useState('');

  const submit = async () => {
    console.log('knowledge_id', data.knowledge_id);
    const postData = {
      id: +id,
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

    const res = await post<any>('/v1/teacher/update_question', {
      data: postData,
    });
    console.log('update_question', res);
    message.success('更新成功');
  };

  const query = async () => {
    const res = await post<any>('/v1/teacher/question_detail', {
      data: {
        question_id: +id,
      },
    });
    setData(res);
  };

  return (
    <div>
      <Input
        placeholder="题目id"
        value={id}
        onChange={(e) => setId(e.target.value)}
      ></Input>
      <Button onClick={query}>开始修改</Button>
      <hr />
      {data && (
        <>
          <QuestionComponent data={data} setData={setData} readOnly={false} />
          <Button onClick={submit}>提交</Button>
        </>
      )}
    </div>
  );
};
export default Component;
