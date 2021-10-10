import { post } from '@/utils/request';
import { Table } from 'antd';
import React, { useEffect, useState } from 'react';
import style from './style.less';

const Component = (props: any) => {
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await post<any>('/v1/teacher/question_list');
      setDataSource(res);
    })();
  }, []);

  const columns = [
    {
      title: '内容',
      dataIndex: ['info_text_content', 'question_info'],
      key: 'content',
    },
    {
      title: 'A',
      dataIndex: ['info_text_content', 'A'],
      key: 'A',
    },
    {
      title: 'B',
      dataIndex: ['info_text_content', 'B'],
      key: 'B',
    },
    {
      title: 'C',
      dataIndex: ['info_text_content', 'C'],
      key: 'C',
    },
    {
      title: 'D',
      dataIndex: ['info_text_content', 'D'],
      key: 'D',
    },
    {
      title: '正答',
      dataIndex: 'correct',
      key: 'correct',
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
      title: '用户ID',
      dataIndex: 'user_id',
      key: 'user_id',
    },
    {
      title: '题目类型',
      dataIndex: 'question_type',
      key: 'question_type',
    },
    {
      title: '分数',
      dataIndex: 'score',
      key: 'score',
    },
  ];

  return <Table dataSource={dataSource} columns={columns} />;
};

export default Component;
