import React from 'react';
import { useState } from 'react';
import {
  Row,
  Col,
  Menu,
  Checkbox,
  Radio,
  Tag,
  TagProps,
  Image,
  Button,
  message,
} from 'antd';
import { CloseCircleTwoTone, CheckCircleTwoTone } from '@ant-design/icons';
import style from '@/pages/studentTraining/style.less';
import { post } from '@/utils/request';
import { connect } from '@@/plugin-dva/exports';

const questionType = {
  0: '',
  1: '( 单选 )',
  2: '( 多选 )',
};

const answerState = ['wrong', 'right', 'none'];

const renderOptions = ({
  question,
  question_type,
  student_answer,
  question_status,
  disabled,
}: {
  question: any;
  question_type: Number;
  student_answer: String;
  disabled: boolean;
  question_status: Number;
}) => {
  if (question_type === 1) {
    return (
      <>
        {['A', 'B', 'C', 'D'].map((option) => {
          const shouldDisable = disabled;
          return (
            <Radio
              style={{ display: 'block' }}
              id={`option-${option}`}
              key={`option-${option}`}
              value={option}
              disabled={shouldDisable}
            >
              {question_status === 1 && student_answer === option && (
                <CheckCircleTwoTone twoToneColor="green" />
              )}
              {question_status === 0 && student_answer === option && (
                <CloseCircleTwoTone twoToneColor="red" />
              )}
              {option}: {question.info_text_content[option]}
            </Radio>
          );
        })}
      </>
    );
  } else {
    return (
      <>
        {['A', 'B', 'C', 'D'].map((option) => {
          const shouldDisable = disabled;
          return (
            <>
              <Checkbox
                id={`option-${option}`}
                key={`option-${option}`}
                value={option}
                defaultChecked={
                  student_answer
                    ? student_answer.split('+').indexOf(option) < 0
                      ? false
                      : true
                    : false
                }
                disabled={shouldDisable}
              >
                {question_status === 1 &&
                  student_answer.indexOf(option) !== -1 && (
                    <CheckCircleTwoTone twoToneColor="green" />
                  )}
                {question_status === 0 &&
                  student_answer.indexOf(option) !== -1 && (
                    <CloseCircleTwoTone twoToneColor="red" />
                  )}
                {option}: {question.info_text_content[option]}
              </Checkbox>
              <br />
            </>
          );
        })}
      </>
    );
  }
};

const QuestionTmp = (props) => {
  const { question, dispatch, fetchQuestion, setAnswers } = props;
  const { question_id, pic_url, sound_url } = question;
  const [currentUserAnswer, setCurrentUserAnswer] = useState(['A']);
  const handleChange = (e) => {
    setCurrentUserAnswer([e.target.value]);
    if (setAnswers) {
      setAnswers((pre) => ({
        ...pre,
        [question_id]: [e.target.value],
      }));
    }
  };

  const _handleChange = (e) => {
    setCurrentUserAnswer(e);
    if (setAnswers) {
      setAnswers((pre) => ({
        ...pre,
        [question_id]: e,
      }));
    }
  };

  const handleSubmit = () => {
    const { question_id } = question;
    if (!currentUserAnswer.length) {
      message.info('请先选择你的答案');
    } else {
      post<any>('/v1/student/Student_assessment_submission', {
        data: {
          id: question_id,
          answer: currentUserAnswer.sort().join('+'),
        },
      }).then((response) => {
        // 由于没有单个问题刷新的接口，只能整体刷新
        if (response) {
          fetchQuestion();
          dispatch({
            type: 'listenTraining/getDiffcultList',
          });
        }
      });
    }
  };

  return (
    <div>
      <h4>问题</h4>
      <div>
        {questionType[question?.question_type || 0]}
        {question.info_text_content
          ? question.info_text_content.question_info
          : null}
      </div>
      {pic_url && (
        <Image
          alt={`msg`}
          style={{ display: 'block' }}
          width={200}
          height={200}
          src={pic_url}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
        />
      )}
      {sound_url && <audio controls autoPlay={false} src={sound_url} />}
      {question.question_status === 1 ? (
        <>
          {renderOptions({
            question,
            question_type: question.question_type,
            student_answer: question.student_answer,
            question_status: question.question_status,
            disabled: true,
          })}
          <h4>正确选项</h4>
          <p>
            {question.correct}:{question.info_text_content[question.correct]}
          </p>
          <h4>题目解析</h4>
          <div>{question.analysis}</div>
        </>
      ) : (
        <>
          <h4>你的选择</h4>

          {question.question_type === 1 ? (
            <Radio.Group buttonStyle="solid" onChange={handleChange}>
              {renderOptions({
                question,
                question_type: question.question_type,
                student_answer: question.student_answer,
                question_status: question.question_status,
                disabled: false,
              })}
            </Radio.Group>
          ) : (
            <Checkbox.Group
              onChange={_handleChange}
              // value={currentUserAnswer}
            >
              {renderOptions({
                question,
                question_type: question.question_type,
                student_answer: question.student_answer,
                question_status: question.question_status,
                disabled: false,
              })}
            </Checkbox.Group>
          )}
        </>
      )}
      <div>
        {question.question_status === 2 && (
          <Button onClick={handleSubmit}>提交该题</Button>
        )}
        {question.question_status === 0 && (
          <Button onClick={handleSubmit}>再次提交</Button>
        )}
      </div>
    </div>
  );
};

export default connect()(QuestionTmp);
