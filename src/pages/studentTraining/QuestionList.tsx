import QuestionTmp from '@/pages/studentTraining/QuestionTmp';
import style from '@/pages/studentTraining/style.less';
import { Tabs, Radio, Button, Tag, Row, message } from 'antd';
import React, { useState } from 'react';
const { TabPane } = Tabs;

const QuestionList = (props) => {
  const { questions, fetchQuestionList, setAnswers } = props;
  const [activeKey, setActiveKey] = useState<string>('1');

  return (
    <div>
      <span>题目列表</span>
      <Tabs
        // defaultActiveKey="1"
        activeKey={activeKey}
        tabPosition={'top'}
        type="card"
        tabBarGutter={15}
        onTabClick={(e) => setActiveKey(e)}
      >
        {questions.length > 0 ? (
          questions.map((question, index) => (
            <TabPane tab={index + 1} key={index + 1}>
              <QuestionTmp
                question={question}
                fetchQuestion={fetchQuestionList}
                setAnswers={setAnswers}
              ></QuestionTmp>
            </TabPane>
          ))
        ) : (
          <div>
            暂无测试题
            {/*{!level[1] ? (*/}
            {/*  message.success('您已完成本章节所有难度的题目')*/}
            {/*) : (*/}
            {/*  <Button onClick={handleNext}>解锁下一难度</Button>*/}
            {/*)}*/}
          </div>
        )}
      </Tabs>
      <Row>
        {parseInt(activeKey) > 1 && (
          <div
            className={style.btn}
            onClick={() => {
              setActiveKey((Number(activeKey) - 1).toString());
            }}
          >
            上一题
          </div>
        )}

        {parseInt(activeKey) < questions.length && (
          <div
            className={style.btn}
            onClick={() => {
              setActiveKey((Number(activeKey) + 1).toString());
            }}
          >
            下一题
          </div>
        )}
      </Row>
    </div>
  );
};

export default QuestionList;
