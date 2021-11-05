import { post } from '@/utils/request';
import { Table, Button, Space, Row, Card, Radio, Badge, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'umi';
// import style from './style.less';
import { Typography } from 'antd';
import { epilog } from 'yargs';

const { Title, Text } = Typography;
interface IResp {
  create_user_id: number;
  end_time: string;
  frame_text_content: Record<string, number>;
  id: number;
  name: string;
  question_count: number;
  score: number;
  start_time: string;
}

const Component = (props: any) => {
  const { id } = useParams() as any;

  const [dataSource, setDataSource] = useState<IResp | null>(null);
  const [state, setState] = useState(0);
  const [updateQuestionId, setUpdateQuestionId] = useState(undefined);
  const [questions, setQuestions] = useState<any[]>([]);

  const fetchQuestionList = () => {
    post<IResp>('/v1/teacher/paper_detail', {
      data: { id: +id },
    }).then(async (res) => {
      setDataSource(res);
      let details = [] as any[];
      for (const [k, id] of Object.entries(res?.frame_text_content ?? {})) {
        const detail = await post<any>('/v1/teacher/detail_question', {
          data: { id },
        });
        details.push(detail);
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
      <Title>{dataSource?.name}</Title>
      <Text>开始时间：{dataSource?.start_time}</Text>
      <Text>结束时间：{dataSource?.end_time}</Text>
      {questions.map((question, idx) => (
        <Row key={`question-${idx}`}>
          <Card
            title={`${idx}. ${question?.info_text_content?.question_info}`}
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
              .map(([k, v]) => (
                <Radio
                  value={k}
                  onClick={(e) => e.preventDefault}
                  checked={k === question?.correct}
                >
                  {k}: {v}
                </Radio>
              ))}
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
