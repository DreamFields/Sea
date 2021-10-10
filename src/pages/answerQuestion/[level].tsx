import React, { useState, useEffect, useCallback } from 'react';
import style from './style.less';
import { connect, useParams, useModel, history } from 'umi';
import { Radio, Input, Space } from 'antd';
import { post } from '@/utils/request';
import { IQuestionListResp, Question, QuestionType } from './types';

const fetchQuestionList = (level: number) =>
  post<IQuestionListResp>('/v1/student/question_list', {
    data: { level },
  });

const Index = (props: any) => {
  const { level, unblockNextLevel } = useModel('useDifficulties');
  const { level: currentLevel = 1 } = useParams() as { level?: number };
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (currentLevel > level) {
      history.push('/listenTraining');
      return;
    }
    fetchQuestionList(currentLevel)?.then(
      ({ not_judge_list, right_list, wrong_list }) => {
        const questions: Question[] = [];
        for (const list of [not_judge_list, right_list, wrong_list]) {
          for (const question of list) {
            let type = QuestionType.NotJudge;
            if ('customer_answer' in question) type = QuestionType.Wrong;
            if ('correct' in question) type = QuestionType.Right;
            questions.push({ ...question, type });
          }
        }
        setQuestions(questions.sort((a, b) => a.question_id - b.question_id));
      },
    );
  });
  const [questionState, setQuestionState] = useState([
    {
      question: '1+1',
      option: ['2', '3', '4', '5'],
      explain: '1+1=2',
      selected: 0,
    },
  ]);
  const [id, setId] = useState(0);

  const handleChange = useCallback(() => {}, [id]);

  return (
    <div className={style.container}>
      <div>
        <h4>题目列表</h4>
        <div className={style.questionNameContainer}>
          {questions.map((item, idx) => (
            <div
              key={idx}
              className={
                idx === id ? style.currentQuestion : style.otherQuestion
              }
              onClick={() => setId(idx)}
            >
              {idx + 1}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4>问题</h4>
        <div>{questions[id].info_text_content.question_info}</div>
        <h4>你的选择</h4>
        <Radio.Group onChange={handleChange} value={questions[id].userAnswer}>
          <Space direction="vertical">
            <Radio value={1}>A</Radio>
            <Radio value={2}>B</Radio>
            <Radio value={3}>C</Radio>
            <Radio value={4}>D</Radio>
          </Space>
        </Radio.Group>
        {/* <h4>题目解析</h4>
        <div>{questions[id].explain}</div> */}
        {id !== 0 && (
          <div
            className={style.btn}
            onClick={() => {
              setId(id - 1);
            }}
          >
            上一题
          </div>
        )}
        {id !== questionState.length - 1 && (
          <div
            className={style.btn}
            onClick={() => {
              setId(id + 1);
            }}
          >
            下一题
          </div>
        )}
      </div>
    </div>
  );
};

function mapStateToProps(state: any) {
  return {};
}

export default connect(mapStateToProps)(Index);
