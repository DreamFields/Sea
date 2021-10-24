import React, { useState } from 'react';
import style from './style.less';
import { Button, Table, Space } from 'antd';

const Index = () => {
  const [data, setData] = useState([
    {
      name: 'ttzztztz',
      chapter1: '10/100',
      chapter2: '10/100',
      chapter3: '10/100',
      chapter4: '10/100',
      chapter5: '10/100',
      chapter6: '10/100',
      chapter7: '10/100',
      chapter8: '10/100',
      chapter9: '10/100',
      chapter10: '10/100',
    },
  ]);

  const columns: any[] = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
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
