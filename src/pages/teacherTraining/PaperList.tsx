import React, { useEffect, useState } from 'react';
import { Table, Button, Space } from 'antd';
import { history } from 'umi';
import { post } from '@/utils/request';

const Index = () => {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const renderPaperList = () => {
    post<any>('/v1/teacher/paper_list').then((res) => {
      setDataSource([...res]);
    });
  };
  useEffect(() => {
    renderPaperList();
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
                history.push(`/teacherTraining/paper/${data.id}/detail`);
              }}
            >
              详情
            </Button>

            <Button
              onClick={() => {
                if (confirm('是否要删除这个试卷？')) {
                  post<any>('/v1/teacher/delete_paper', {
                    data: { id: data.id },
                  }).then((res) => {
                    console.log('delete paper response', res);
                    renderPaperList();
                  });
                }
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
