import React, { useState, useEffect } from 'react';
import style from './style.less';
import { Button, Table, Space } from 'antd';
import { post } from '@/utils/request';

const Index = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    post<any>('/v1/teacher/Student_assessment').then((res) => {
      setData([...res]);
    });
  }, []);

  const columns: any[] = [
    {
      title: '名称',
      dataIndex: 'user_name',
      key: 'user_name',
    },
  ];

  for (let i = 1; i <= 10; i++) {
    columns.push({
      title: `chapter${i}`,
      dataIndex: `chapter${i}`,
      key: `chapter${i}`,
    });
  }

  columns.push({
    title: '操作',
    key: 'action',
    fixed: 'right',
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
  });

  return <Table columns={columns} dataSource={data} />;
};

export default Index;
