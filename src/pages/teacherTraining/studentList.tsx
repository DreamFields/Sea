import React, { useEffect, useState } from 'react';
import style from './style.less';
import { post } from '@/utils/request';
import { Table } from 'antd';

const Component = (props: any) => {
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await post<any>('/v1/teacher/student_list');
      console.log(res);
      setDataSource(res);
    })();
  }, []);

  const columns: any = [
    {
      title: '难度',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '用户名',
      dataIndex: 'nickname',
      key: 'nickname',
    },
  ];
  for (let idx = 0; idx < 5; idx++) {
    columns.push({
      title: `难度${idx + 1}作答`,
      dataIndex: ['question_count', (idx + 1).toString()],
      key: `question_count_${idx}`,
    });
    columns.push({
      title: `难度${idx + 1}正答`,
      dataIndex: ['question_correct', (idx + 1).toString()],
      key: `question_correct_${idx}`,
    });
  }

  return <Table dataSource={dataSource} columns={columns} />;
};

export default Component;
