import React, { useState, useEffect, useCallback } from 'react';
import style from './style.less';
import { connect, useParams, useModel, history } from 'umi';
import { Radio, Input, Image, Space, RadioChangeEvent, Button } from 'antd';
import { post } from '@/utils/request';
import {
  IQuestionListResp,
  Question,
  QuestionType,
  QuestionDetail,
} from './types';
import produce from 'immer';
import { useImmer } from 'use-immer';

const fetchQuestionList = (level: number) =>
  post<IQuestionListResp>('/v1/student/question_list', {
    data: { level },
  });

const submitAnswer = (question_id: number, answer: string) =>
  post<{
    customer_level: number;
    do_right: number;
  }>('v1/student/answer_submit', { data: { question_id, answer } });

const Index = (props: any) => {
  const { level, unblockNextLevel } = useModel('useDifficulties');
  const currentLevel = +((useParams() as { level?: string }).level ?? 1);

  const [questions, setQuestions] = useImmer<Question[]>([]);
  const [currentQuestionDetails, setCurrentQuestionDetails] =
    useState<null | QuestionDetail>(null);
  const [id, setId] = useState(0);

  const updateQuestionList = useCallback((currentLevel) => {
    fetchQuestionList(currentLevel)?.then(
      ({ not_judge_list, right_list, wrong_list }) => {
        const questions: Question[] = [];
        console.log(not_judge_list, right_list, wrong_list);
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
  }, []);

  useEffect(() => {
    if (currentLevel > level) {
      history.push('/listenTraining');
      return;
    }
    updateQuestionList(currentLevel);
  }, []);

  useEffect(() => {
    const { question_id } = questions[id] ?? {};
    if (!question_id) return;
    post<QuestionDetail>('v1/student/question_detail', {
      data: { question_id },
    }).then(setCurrentQuestionDetails);
  }, [id, questions]);

  const handleChange = useCallback(
    (e: RadioChangeEvent) => {
      setQuestions((draft) => {
        draft[id].userAnswer = e.target.value;
      });
    },
    [id],
  );

  const handleSubmit = useCallback(() => {
    const { question_id, userAnswer } = questions[id] || {};
    if (question_id && userAnswer) {
      submitAnswer(question_id, userAnswer).then(
        ({ do_right, customer_level } = {} as any) => {
          if (!do_right || !customer_level) return;
          // if (do_right)
          //   setQuestions((draft) => {
          //     draft[id].type = do_right as QuestionType;
          //   });
          updateQuestionList(currentLevel);
          if (customer_level > currentLevel) unblockNextLevel();
        },
      );
    }
  }, [id, questions]);

  const currentQuestion = questions[id];

  if (!currentQuestion || !currentQuestionDetails) return null;

  const { pic_url, sound_url } = currentQuestionDetails;

  const renderOptions = ({ disabled }: { disabled: boolean }) => (
    <Space direction="vertical">
      {['A', 'B', 'C', 'D'].map((option) => (
        <Radio id={`option-${option}`} value={option} disabled={disabled}>
          {option}: {currentQuestionDetails.info_text_content[option]}
        </Radio>
      ))}
    </Space>
  );

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
        <div>{currentQuestionDetails.info_text_content.question_info}</div>
        {pic_url && (
          <Image
            width={200}
            height={200}
            src={pic_url}
            fallback="data:image/png;base64,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"
          />
        )}
        {sound_url && <audio autoPlay={false} src={sound_url} />}

        {'analysis' in currentQuestion ? (
          <>
            {renderOptions({ disabled: true })}
            <h4>正确选项</h4>
            <p>
              {currentQuestion.correct}:
              {
                currentQuestionDetails.info_text_content[
                  currentQuestion.correct
                ]
              }
            </p>
            <h4>题目解析</h4>
            <div>{currentQuestion.analysis}</div>
          </>
        ) : (
          <>
            <h4>你的选择</h4>

            <Radio.Group
              onChange={handleChange}
              value={currentQuestion.userAnswer ?? ''}
            >
              {renderOptions({ disabled: false })}
            </Radio.Group>
          </>
        )}

        {currentQuestion.type !== QuestionType.Right && (
          <Button onClick={handleSubmit}>提交该题</Button>
        )}

        {'analysis' in currentQuestion && <></>}

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
        {id !== questions.length - 1 && (
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
