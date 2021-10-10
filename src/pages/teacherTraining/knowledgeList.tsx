import { post } from '@/utils/request';
import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import style from './style.less';

const Component = (props: any) => {
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await post<any>('/v1/teacher/knowledge_list');
      console.log(res);
      setDataSource(res);
    })();
  }, []);

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
    },
  ];

  return <Table dataSource={dataSource} columns={columns} />;
};

export default Component;
