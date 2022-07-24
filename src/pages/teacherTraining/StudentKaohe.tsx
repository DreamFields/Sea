/*
 * @Author: your name
 * @Date: 2021-11-13 21:24:31
 * @LastEditTime: 2021-11-28 16:36:49
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \Sea\src\pages\teacherTraining\StudentKaohe.tsx
 */
import React, { useState, useEffect } from 'react';
import style from './style.less';
import { Button, Table, Space, message } from 'antd';
import { post } from '@/utils/request';
import { history } from 'umi';

const Index = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    post<any>('/v1/teacher/Student_assessment').then((res) => {
      setData(res.map((r, i) => ({ ...r, key: i })));
    });
  }, []);

  const columns: any[] = [
    {
      title: '名称',
      dataIndex: 'user_name',
      key: 'user_name',
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
            history.push(`/teacherTraining/kaohe/${data.user_id}`);
            console.log(data.user_id);
          }}
        >
          详情
        </Button>
        <Button
          onClick={() => {
            post<any>('/v1/teacher/Clear_All_Student_Assessment', {
              data: { user_id: data.user_id },
            }).then((res) => {
              message.success('清空记录成功！');
              console.log(data.user_id);
              post<any>('/v1/teacher/Student_assessment').then((res) => {
                setData(res.map((r, i) => ({ ...r, key: i })));
              });
            });
          }}
        >
          清空所有
        </Button>
        <Button
          onClick={() => {
            post<any>('/v1/teacher/Clear_Now_Student_Assessment', {
              data: { user_id: data.user_id },
            }).then((res) => {
              message.success('清空记录成功！');
              console.log(data.user_id);
              post<any>('/v1/teacher/Student_assessment').then((res) => {
                setData(res.map((r, i) => ({ ...r, key: i })));
              });
            });
          }}
        >
          清空当前
        </Button>
      </Space>
    ),
  });

  return <Table columns={columns} dataSource={data} />;
};

export default Index;
