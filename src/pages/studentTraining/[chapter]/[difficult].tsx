import React, { useEffect, useState } from 'react';
import { useParams, history } from 'umi';
import { Tabs, Radio, Button, Tag, Row, message } from 'antd';
import '../style.less';
const { TabPane } = Tabs;
import {
  CloseCircleOutlined,
  HeartTwoTone,
  CheckCircleTwoTone,
  CloseCircleFilled,
} from '@ant-design/icons';
import { connect } from '@@/plugin-dva/exports';
import { post } from '@/utils/request';
import QuestionTmp from '@/pages/studentTraining/Question';
import style from '@/pages/studentTraining/style.less';
import QuestionList from '@/pages/studentTraining/QuestionList';

const Component = (props: any) => {
  const { dispatch, difficultList } = props;
  const { chapter, difficult } = useParams() as any;
  const [questions, setQuestions] = useState<any>([]);
  const fetchQuestionList = () => {
    post<any>('/v1/student/question_list', {
      data: {
        chapter: +chapter,
        difficult: +difficult,
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
  }, [chapter, difficult]);

  const maxDiff = difficultList[`difficult${chapter}`];
  console.log('maxDiff', maxDiff);

  const handleNext = (e) => {
    // console.log(e);
    // message.success('可选难度列表已经更新!');
    history.push(`/studentTraining/${chapter}/${+difficult + 1}`);
  };

  // console.log('activeKey', activeKey, typeof activeKey);
  return (
    <div>
      <QuestionList
        questions={questions}
        fetchQuestionList={fetchQuestionList}
      ></QuestionList>
      {maxDiff > difficult ? (
        <Button onClick={handleNext}>下一关</Button>
      ) : null}
    </div>
  );
};

const mapStateToProps = ({ listenTraining }) => {
  return {
    difficultList: listenTraining.difficultList,
  };
};

export default connect(mapStateToProps)(Component);
