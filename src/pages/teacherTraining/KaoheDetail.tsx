import React, { useState } from 'react';
import { Table } from 'antd';

const Index = () => {
  const [data, setData] = useState([
    {
      chapter: '章节1',
      ...['1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    },
  ]);

  const columns: any[] = [
    {
      title: '',
      dataIndex: 'chapter',
      key: '章节',
      fixed: 'left',
    },
  ];

  for (let i = 1; i <= 10; i++) {
    columns.push({
      title: `难度${i}`,
      dataIndex: `${i}`,
      key: `difficult${i}`,
    });
  }

  return <Table columns={columns} dataSource={data} />;
};
export default Index;
