import { post } from '@/utils/request';
import { Table, Button, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import AddQuestion from './addQuestion';
import UpdateQuestion from './updateQuestion';
import style from './style.less';

const Component = (props: any) => {
  const difficult = '1';
  const chapter = '1';

  const [dataSource, setDataSource] = useState([]);
  const [state, setState] = useState(0);
  const [updateQuestionId, setUpdateQuestionId] = useState(undefined);

  useEffect(() => {
    post<any>('/v1/teacher/question_list').then((res) => {
      setDataSource(res);
    });
  }, [state]);

  const columns = [
    {
      title: '题干',
      dataIndex: ['question_info_text_content', 'question_info'],
      key: 'content',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
    },
    {
      title: '难度',
      dataIndex: 'difficult',
      key: 'difficult',
    },
    {
      title: '用户名',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: '查看题目',
      key: 'actions',
      render(_, data: any) {
        return (
          <Space size="middle">
            <Button
              onClick={() => {
                setState(2);
                setUpdateQuestionId(data.id);
              }}
            >
              查看题目
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      {state === 0 && (
        <>
          <Button onClick={() => setState(1)}>添加题目</Button>
          <Table dataSource={dataSource} columns={columns} />
        </>
      )}

      {state > 0 && <Button onClick={() => setState(0)}>返回题目列表</Button>}

      {state === 1 && (
        <AddQuestion
          chapter={chapter}
          difficult={difficult}
          onDone={() => setState(0)}
        />
      )}
      {state === 2 && (
        <UpdateQuestion onDone={() => setState(0)} id={updateQuestionId} />
      )}
    </div>
  );
};

export default Component;
