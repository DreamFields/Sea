import React, { useState } from 'react';
import style from './style.less';
import { Button, Table, Space } from 'antd';

const Index = () => {
  const [data, setData] = useState([
    {
      key: '1',
      name: '11',
      avg: '100',
      startTime: new Date().toString(),
      endTime: new Date().toString(),
    },
  ]);

  const columns = [
    {
      title: '试卷名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '均分',
      dataIndex: 'avg',
      key: 'avg',
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (data) => (
        <Space size="middle">
          <Button
            onClick={() => {
              console.log('detail paper', data);
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
