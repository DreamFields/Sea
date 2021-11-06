import { useParams, history } from 'umi';
import React, { useEffect, useState } from 'react';
import { post } from '@/utils/request';
import QuestionList from '@/pages/studentTraining/QuestionList';
import { Button, message } from 'antd';

const PaperIndex = (props) => {
  const id = (useParams() as any).id;
  const [questions, setQuestions] = useState<any>([]);
  const [answers, setAnswers] = useState<any>({});
  const fetchQuestionList = () => {
    post<any>('/v1/student/exam_detail', {
      data: {
        id,
      },
    }).then((res) => {
      setQuestions(res.question_list);
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
    <div
      style={{ padding: '30px', border: '1px solid #000000', margin: '50px' }}
    >
      <QuestionList
        questions={questions}
        fetchQuestionList={fetchQuestionList}
        setAnswers={setAnswers}
      ></QuestionList>
      <Button
        onClick={() => {
          console.log('answers', answers);
          const questionList = Object.keys(answers).map((qid) => ({
            question_id: parseInt(qid, 10),
            answer: answers[qid].sort().join('+'),
          }));
          console.log('questionList', questionList);

          post<any>('/v1/student/paper_submit', {
            data: {
              exam_id: parseInt(id, 10),
              question_customer_answer: questionList,
            },
          }).then((res) => {
            console.log('res', res);
            message.success('已完成考试');
            history.push('/studentTraining/PaperCanDo');
          });
        }}
      >
        提交
      </Button>
    </div>
  );
};

export default PaperIndex;
