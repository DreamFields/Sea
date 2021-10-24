import React, { useEffect, useState } from 'react';
import { Table, Button, Space } from 'antd';

const Index = () => {
  const [dataSource, setDataSource] = useState([
    {
      name: '114514',
      start_time: new Date().toString(),
      end_time: new Date().toString(),
      create_time: new Date().toString(),
    },
  ]);
  const [state, setState] = useState(0);
  const [updateQuestionId, setUpdateQuestionId] = useState(undefined);

  const columns = [
    {
      title: '试卷名',
      dataIndex: 'name',
    },
    {
      title: '开始时间',
      dataIndex: 'start_time',
      key: 'start_time',
    },
    {
      title: '结束时间',
      dataIndex: 'end_time',
      key: 'end_time',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
    },
    {
      title: '操作',
      key: 'actions',
      render(_, data: any) {
        return (
          <Space size="middle">
            <Button
              onClick={() => {
                console.log('detail', data);
              }}
            >
              详情
            </Button>

            <Button
              onClick={() => {
                console.log('delete', data);
              }}
            >
              删除
            </Button>
          </Space>
        );
      },
    },
  ];

  return <Table dataSource={dataSource} columns={columns} />;
};

export default Index;
