import React, { FC, useState, useEffect } from 'react';
import { post } from '@/utils/request';
import style from './style.less';
import ExamCanDo from './PaperCanDo';
import PaperDone from './PaperDone';
// import TeacherIndex from '../teacherTraining/index';

import CookieUtil from '@/utils/cookie.js';
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
import { connect } from 'react-redux';
import { set } from 'lodash';

const MAX_LEVEL = 5;
const chooseArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const { SubMenu } = Menu;

interface IQuestionTagProps extends Pick<TagProps, 'onClick' | 'children'> {
  question: any;
  checked: boolean;
}

const QuestionTag: FC<IQuestionTagProps> = ({
  question,
  checked,
  onClick,
  children,
}) => {
  let color: TagProps['color'];
  switch (question.question_status) {
    case 0:
      color = 'red';
      break;
    case 1:
      color = 'green';
      break;
    case 2:
      color = 'default';
      break;
  }
  return (
    <Tag
      style={{ cursor: 'pointer' }}
      color={color}
      onClick={onClick}
      className={checked ? style.currentQuestion : style.otherQuestion}
    >
      {children}
    </Tag>
  );
};

const StudentIndex = (props: any) => {
  const { dispatch, questionList, difficultList } = props;

  const [view, setView] = useState(0);
  const [next, setNext] = useState(false);
  const [index, setIndex] = useState(0);
  const [level, setLevel] = useState([0, 0]);
  const [currentUserAnswer, setCurrentUserAnswer] = useState(['A']);
  const currentQuestion = questionList[index] || {};
  const { pic_url = null, sound_url = null } = currentQuestion;
  const [curMenu, setcurMenu] = useState('');

  useEffect(() => {
    setView(2);
  }, [questionList, difficultList]);

  useEffect(() => {
    setView(0);
  }, []);

  useEffect(() => {
    console.log('view', view);
  }, [view]);

  const handleClick = (e) => {
    setLevel([
      parseInt(e.keyPath[1], 10),
      parseInt([...e.keyPath[0].split('')].pop()),
    ]);
    // //向后端发送请求以获得对应难度题目
    setView(1);
    dispatch({
      type: 'listenTraining/getQuestionList',
      payload: {
        chapter: parseInt(e.keyPath[1], 10),
        difficult: parseInt([...e.keyPath[0].split('')].pop()),
      },
    });
    setIndex(0);
  };

  const handleSubmit = () => {
    setView(1);
    const { question_id } = currentQuestion;
    if (!currentUserAnswer.length) {
      message.info('请先选择你的答案');
    } else {
      post<any>('/v1/student/Student_assessment_submission', {
        data: {
          id: question_id,
          answer: currentUserAnswer.join('+'),
        },
      })
        .then((response) => {
          if (response) {
            //刷新questionList
            dispatch({
              type: 'listenTraining/getQuestionList',
              payload: {
                chapter: level[0],
                difficult: level[1],
              },
            });
          } else {
            message.error('提交失败');
          }
          return response;
        })
        .then((response) => {
          const question = questionList.filter(
            (item) => item.question_id === response.question_id,
          )[0];
          setIndex(questionList.indexOf(question));
          if (response.status) {
            setNext(true);
          }
        });
    }
  };

  const handleNext = (e) => {
    console.log(e);
    message.success('可选难度列表已经更新!');
    dispatch({
      type: 'listenTraining/getDiffcultList',
    });
    setTimeout(() => {
      setView(0);
    }, 5000);
  };

  const renderOptions = ({
    question_type,
    student_answer,
    question_status,
    disabled,
  }: {
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
                {question_status ? (
                  student_answer === option ? (
                    <CheckCircleTwoTone twoToneColor="green" />
                  ) : (
                    <span>&nbsp;</span>
                  )
                ) : student_answer === option ? (
                  <CloseCircleTwoTone twoToneColor="red" />
                ) : (
                  <span>&nbsp;</span>
                )}
                {option}: {currentQuestion.info_text_content[option]}
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
                  {option}: {currentQuestion.info_text_content[option]}
                </Checkbox>
                <br />
              </>
            );
          })}
        </>
      );
    }
  };
  //在不同条件下渲染答案列表

  const handleChange = (e) => {
    setCurrentUserAnswer([e.target.value]);
  };

  const _handleChange = (e) => {
    setCurrentUserAnswer(e);
  };

  //记录当前问题的选项用于传给后端
  console.log(level[1]);

  const Exercise = () => {
    return view ? (
      view === 1 ? (
        <div>Loading</div>
      ) : questionList.length <= 0 ? (
        <div>
          本章节暂无测试题
          {!level[1] ? (
            message.success('您已完成本章节所有难度的题目')
          ) : (
            <Button onClick={handleNext}>解锁下一难度</Button>
          )}
        </div>
      ) : (
        <div>
          <div>
            <h4>题目列表</h4>
            <Row className="questionNameContainer">
              {questionList.map((item, index) => (
                <QuestionTag
                  question={item}
                  checked={questionList[index] === currentQuestion}
                  key={index}
                  onClick={() => setIndex(index)}
                >
                  {index + 1}
                </QuestionTag>
              ))}
            </Row>
          </div>
          <div>
            <h4>问题</h4>
            <div>
              {currentQuestion?.question_type === 1 ? '(单选) ' : '(多选)'}
              {currentQuestion.info_text_content
                ? currentQuestion.info_text_content.question_info
                : null}
            </div>
            {pic_url && (
              <Image
                alt={`msg`}
                style={{ display: 'block' }}
                width={200}
                height={200}
                src={pic_url}
                fallback="data:image/png;base64,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"
              />
            )}
            {sound_url && <audio controls autoPlay={false} src={sound_url} />}

            {currentQuestion.question_status === 1 ? (
              <>
                {renderOptions({
                  question_type: currentQuestion.question_type,
                  student_answer: currentQuestion.student_answer,
                  question_status: currentQuestion.question_status,
                  disabled: true,
                })}
                <h4>正确选项</h4>
                <p>
                  {currentQuestion.correct}:
                  {currentQuestion.info_text_content[currentQuestion.correct]}
                </p>
                <h4>题目解析</h4>
                <div>{currentQuestion.analysis}</div>
              </>
            ) : (
              <>
                <h4>你的选择</h4>

                {currentQuestion.question_type === 1 ? (
                  <Radio.Group buttonStyle="solid" onChange={handleChange}>
                    {renderOptions({
                      question_type: currentQuestion.question_type,
                      student_answer: currentQuestion.student_answer,
                      question_status: currentQuestion.question_status,
                      disabled: false,
                    })}
                  </Radio.Group>
                ) : (
                  <Checkbox.Group
                    onChange={_handleChange}
                    // value={currentUserAnswer}
                  >
                    {renderOptions({
                      question_type: currentQuestion.question_type,
                      student_answer: currentQuestion.student_answer,
                      question_status: currentQuestion.question_status,
                      disabled: false,
                    })}
                  </Checkbox.Group>
                )}
              </>
            )}

            {'analysis' in currentQuestion && <></>}
            <Row>
              {index !== 0 && (
                <div
                  className={style.btn}
                  onClick={() => {
                    setIndex(index - 1);
                  }}
                >
                  上一题
                </div>
              )}

              {index !== questionList.length - 1 && (
                <div
                  className={style.btn}
                  onClick={() => {
                    setIndex(index + 1);
                  }}
                >
                  下一题
                </div>
              )}
            </Row>
            {currentQuestion.question_status === 2 && (
              <Button onClick={handleSubmit}>提交该题</Button>
            )}
            {currentQuestion.question_status === 0 && (
              <Button onClick={handleSubmit}>再次提交</Button>
            )}
            <Button
              onClick={handleNext}
              style={{ display: next ? 'block' : 'none' }}
            >
              下一关
            </Button>
          </div>
        </div>
      )
    ) : (
      <div>请选择对应章节题目以及难度</div>
    ); //view=0是默认界面
  };

  const RenderRightContent = () => {
    switch (curMenu) {
      case 'done':
        return <PaperDone />;
        break;
      case 'canDo':
        return <ExamCanDo />;
        break;
      default:
        return <Exercise />;
    }
  };

  return (
    <div
      style={{
        width: '95%',
        marginLeft: '2.5%',
        height: '95%',
        background: '#2F2F2F',
        marginTop: 15,
      }}
    >
      <Row gutter={20} style={{ height: '100%' }}>
        <Col span={5} style={{ height: '100%' }}>
          <Menu
            style={{ width: '100%', fontSize: 30 }}
            mode="inline"
            onClick={(e) => {
              console.log('点击菜单项', e);
              setcurMenu(e.key);
            }}
          >
            <SubMenu key="sub1" title="考核">
              {chooseArr.map((item, index) => {
                let num = index;
                return (
                  <Menu.Item key={`c${item}`}>
                    <Menu
                      style={{ width: '100%', background: '#2F2F2F' }}
                      mode="vertical"
                      onClick={handleClick}
                    >
                      <SubMenu
                        key={item}
                        title={`章节 ${item}`}
                        style={{ fontSize: 20 }}
                      >
                        {chooseArr.map((item, index) => {
                          return (
                            <Menu.Item
                              key={`diff${index + 1}`}
                              disabled={
                                index + 1 > difficultList[`difficult${num + 1}`]
                              }
                              style={{ fontSize: 20 }}
                            >
                              {`难度 ${index + 1}`}
                            </Menu.Item>
                          );
                        })}
                      </SubMenu>
                    </Menu>
                  </Menu.Item>
                );
              })}
            </SubMenu>
            <SubMenu key="sub2" title="考试">
              <Menu.Item key="done" /* onClick={} */> 已经参加的考试</Menu.Item>
              <Menu.Item key="canDo">可以参加的考试</Menu.Item>
            </SubMenu>
          </Menu>
        </Col>
        <Col span={3} style={{ height: '100%' }}></Col>
        <Col span={16} style={{ height: '100%' }}>
          {/*<PaperDone></PaperDone>*/}
          <RenderRightContent />
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = ({ listenTraining }) => {
  return {
    difficultList: listenTraining.difficultList,
    questionList: listenTraining.questionList,
  };
};

export default connect(mapStateToProps)(StudentIndex);
