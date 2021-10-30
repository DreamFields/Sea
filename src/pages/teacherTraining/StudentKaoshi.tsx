import React, { useState, useEffect } from 'react';
import style from './style.less';
import { Button, Table, Space } from 'antd';
import { post } from '@/utils/request';
import { history } from 'umi';

const Index = () => {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    post<any>('/v1/teacher/Student_Exam_situation').then((res) => {
      setData([...res]);
    });
  }, []);

  const columns = [
    {
      title: '试卷名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '问题数量',
      dataIndex: 'question_count',
      key: 'question_count',
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
      title: '操作',
      key: 'action',
      render: (data) => (
        <Space size="middle">
          <Button
            onClick={() => {
              console.log('detail paper', data);
              history.push(`/teacherTraining/kaoshi/${data.id}`);
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
