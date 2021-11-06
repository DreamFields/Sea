import { useParams } from 'umi';
import React, { useEffect, useState } from 'react';
import { post } from '@/utils/request';
import QuestionList from '@/pages/studentTraining/QuestionList';
import { Button } from 'antd';

const PaperIndex = (props) => {
  const id = (useParams() as any).id;
  const [questions, setQuestions] = useState<any>([]);
  const [answers, setAnswers] = useState<any>({});
  const fetchQuestionList = () => {
    post<any>('/v1/student/done_paper_list', {
      data: {
        exam_id: +id,
      },
    }).then((res) => {
      setQuestions(res);
      console.log('res', res);
    });
  };
  useEffect(() => {
    fetchQuestionList();
    // dispatch({
    //   type: 'listenTraining/getDiffcultList',
    // });
  }, [id]);

  return (
    <div>
      <QuestionList
        questions={questions}
        fetchQuestionList={fetchQuestionList}
        setAnswers={setAnswers}
      ></QuestionList>
    </div>
  );
};

export default PaperIndex;
