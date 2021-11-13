import { post } from '@/utils/request';
import { Button, Space, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import style from './style.less';

const Component = (props: any) => {
  const [dataSource, setDataSource] = useState([]);

  const fetchExamList = () => {
    post<any>('/v1/student/exam_undo_list').then((res) => {
      res = res.paper_undo_list;
      console.log('/v1/student/exam_undo_list res', res);

      setDataSource(res.map((r) => ({ ...r, key: r.id })));
    });
  };
  useEffect(() => {
    fetchExamList();
  }, []);

  const columns = [
    {
      title: '试卷名称',
      dataIndex: 'name',
      key: 'name',
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
      title: '分数',
      dataIndex: 'score',
      key: 'score',
    },
    {
      title: '详情',
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
          </Space>
        );
      },
    },
  ];

  return <Table dataSource={dataSource} columns={columns} />;
};

export default Component;
