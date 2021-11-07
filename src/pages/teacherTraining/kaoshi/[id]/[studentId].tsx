import { post } from '@/utils/request';
import {
  Table,
  Button,
  Space,
  Row,
  Card,
  Radio,
  Badge,
  Tag,
  Divider,
  Descriptions,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'umi';
// import style from './style.less';
import { Typography } from 'antd';

const { Title, Text } = Typography;
interface IResp {
  customer_score: number;
  exam_name: string;
  question_correct_count: number;
  question_customer_answer: {
    question_customer_answer: {
      customer_answer: string;
      question_id: number;
      question_status: 1;
    }[];
  };
  total_count: number;
  total_score: number;
  user_name: string;
}

const Component = (props: any) => {
  const { studentId } = useParams() as any;
  const [dataSource, setDataSource] = useState<IResp | null>(null);
  const [state, setState] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]);

  const fetchQuestionList = () => {
    post<IResp>('/v1/teacher/Student_Exam_detail_situation_detail', {
      data: { id: +studentId },
    }).then(async (res) => {
      setDataSource(res);
      let details = [] as any[];
      for (const custom of Object.values(
        res?.question_customer_answer.question_customer_answer ?? {},
      )) {
        const { question_id, customer_answer, question_status } = custom;
        const detail = await post<any>('/v1/teacher/detail_question', {
          data: { question_id },
        });
        details.push({ ...detail, customer_answer, question_status });
      }
      console.log('details:', details);
      setQuestions(details);
    });
  };
  useEffect(() => {
    fetchQuestionList();
  }, [state]);

  return (
    <>
      <Divider />
      <Descriptions
        title={dataSource?.exam_name}
        bordered
        size="small"
        column={{ xxl: 1, xl: 3, lg: 3, md: 3, sm: 1, xs: 1 }}
      >
        {/* <Descriptions.Item label="OpenID">{data.openid}</Descriptions.Item> */}
        <Descriptions.Item label="提交人">
          {dataSource?.user_name}
        </Descriptions.Item>
        <Descriptions.Item label="得分">
          {dataSource?.customer_score}/{dataSource?.total_score}
        </Descriptions.Item>
      </Descriptions>
      {questions.map((question, idx) => (
        <Row key={`question-${idx + 1}`}>
          <Card
            title={`${idx + 1}. ${question?.info_text_content?.question_info}`}
            extra={
              <>
                <Tag
                // style={{ backgroundColor: '#52c41a' }}
                >
                  {question?.question_type === 1 ? '单选' : '多选'}
                </Tag>
                <Tag
                // style={{ backgroundColor: '#52c41a' }}
                >
                  章节：{question?.chapter}
                </Tag>
                <Tag
                // style={{ backgroundColor: '#52c41a' }}
                >
                  难度：{question.difficult}
                </Tag>
                <Tag
                // style={{ backgroundColor: '#52c41a' }}
                >
                  知识点：{question?.knowledge_id}
                </Tag>
              </>
            }
            style={{ width: '100%' }}
          >
            {Object.entries(question?.info_text_content)
              .filter(([k]) => k !== 'question_info')
              .map(([k, v]) => {
                const color =
                  k === question?.correct
                    ? 'green'
                    : k === question?.customer_answer
                    ? 'red'
                    : 'inherit';
                return (
                  <Radio
                    style={{ color }}
                    value={k}
                    onClick={(e) => e.preventDefault}
                    checked={k === question?.correct}
                  >
                    {k}: {v}
                  </Radio>
                );
              })}
            <Row>
              <Text>分析：{question.analysis}</Text>
            </Row>
          </Card>
        </Row>
      ))}
    </>
    // <div>
    //   {state === 0 && (
    //     <>
    //       <Button onClick={() => setState(1)}>添加题目</Button>
    //       <Table dataSource={dataSource} columns={columns} />
    //     </>
    //   )}

    //   {state > 0 && <Button onClick={() => setState(0)}>返回题目列表</Button>}

    //   {state === 1 && (
    //     <AddQuestion
    //       chapter={chapter}
    //       difficult={difficult}
    //       onDone={() => setState(0)}
    //     />
    //   )}
    //   {state === 2 && (
    //     <UpdateQuestion onDone={() => setState(0)} id={updateQuestionId} />
    //   )}
    // </div>
  );
};

export default Component;
