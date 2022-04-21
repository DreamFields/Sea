import React, { useState, useEffect } from 'react';
import style from './style.less';
import QuestionComponent from './questionComponent';
import { Button, message } from 'antd';
import { post } from '@/utils/request';

const Component = (props: any) => {
  const [data, setData] = useState<any>(null);
  const { id, onDone } = props;

  const submit = async () => {
    if (data === null) {
      console.log('submit updatequestion null');
      return;
    }

    console.log('knowledge_id', data.knowledge_id);
    const postData = {
      id: +id,
      difficult: +data.difficult,
      knowledge_id: +data.knowledge_id ?? 1,
      question_type: +data.question_type,
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
      question_bank_type: +data.question_bank_type,
      score: +data.score,
    };

    const res = await post<any>('/v1/teacher/update_question', {
      data: postData,
    });
    console.log('update_question', res);
    message.success('修改成功！');
    onDone && onDone();
  };

  useEffect(() => {
    if (id === undefined) {
      return;
    }
    post<any>('/v1/teacher/detail_question', {
      data: {
        question_id: +id,
      },
    }).then((res1) => {
      console.log('/v1/teacher/detail_question res', res1);
      if (res1.info_text_content === null) res1.info_text_content = {} as any;
      setData({ ...res1 });
    });
  }, [id]);

  console.log('data', data);
  return (
    <div>
      {data && (
        <>
          <QuestionComponent
            data={{ ...data, question_id: id }}
            onDataChange={setData}
            readOnly={false}
          />
          <Button onClick={submit}>提交</Button>
        </>
      )}
    </div>
  );
};
export default Component;
