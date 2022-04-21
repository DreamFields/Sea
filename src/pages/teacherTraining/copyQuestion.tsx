/*
 * @Author: your name
 * @Date: 2021-12-08 16:02:42
 * @LastEditTime: 2021-12-09 18:00:36
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \Sea\src\pages\teacherTraining\copyQuestion.tsx
 */
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
    const postData: any = {
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

    if (data.question_id) {
      postData.id = data.question_id;
    }

    console.log(data.question_id);
    console.log(postData);
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
      (res1.question_pic = null),
        (res1.question_sound_url = null),
        setData({ ...res1 });
    });
  }, [id]);

  console.log('data', data);
  return (
    <div>
      {data && (
        <>
          <QuestionComponent
            data={data}
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
