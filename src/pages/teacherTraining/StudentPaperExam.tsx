import React, { useState } from 'react';
import style from './style.less';
import { Button, Table, Space } from 'antd';

const Index = () => {
  const [data, setData] = useState([
    {
      user_name: 'ttzztztz',
      score: '0',
      correctCount: '5/10',
    },
  ]);

  const columns: any[] = [
    {
      title: '名称',
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
      title: '分数',
      dataIndex: 'score',
      key: 'score',
    },
    {
      title: '正答率',
      dataIndex: 'correctCount',
      key: 'correctCount',
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: (data) => (
        <Space size="middle">
          <Button
            onClick={() => {
              console.log('detail paper student', data);
            }}
          >
            详情
          </Button>
        </Space>
      ),
    },
  ];

  return <Table columns={columns} dataSource={data} />;
};

export default Index;
