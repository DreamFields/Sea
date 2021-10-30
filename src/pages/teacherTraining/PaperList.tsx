import React, { useEffect, useState } from 'react';
import { Table, Button, Space } from 'antd';
import { post } from '@/utils/request';

const Index = () => {
  const [dataSource, setDataSource] = useState<any[]>([]);

  useEffect(() => {
    post<any>('/v1/teacher/paper_list').then((res) => {
      setDataSource([...res]);
    });
  }, []);

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
      title: '问题数量',
      dataIndex: 'question_count',
      key: 'question_count',
    },
    {
      title: '分数',
      dataIndex: 'score',
      key: 'score',
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
