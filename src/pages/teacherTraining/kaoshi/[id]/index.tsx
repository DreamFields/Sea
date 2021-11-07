import React, { useState, useEffect } from 'react';
import style from './style.less';
import { Button, Table, Space } from 'antd';
import { history, useParams } from 'umi';
import { post } from '@/utils/request';

const Index = () => {
  const id = (useParams() as any).id;
  console.log('teacher training student kaoshi detail router param', id);

  const [data, setData] = useState<any>([]);
  useEffect(() => {
    post<any>('/v1/teacher/Student_Exam_detail_situation', {
      data: { id },
    }).then((res) => {
      console.log('Student_Exam_detail_situation', res);
      setData(res);
    });
  }, []);

  const columns: any[] = [
    {
      title: '学生名称aaa',
      dataIndex: 'student_name',
      key: 'student_name',
    },
    {
      title: '答对题目',
      dataIndex: 'correct',
      key: 'correct',
    },
    {
      title: '用户得分',
      dataIndex: 'user_score',
      key: 'user_score',
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
              history.push(`/teacherTraining/kaoshi/${id}/${data.user_id}`);
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
