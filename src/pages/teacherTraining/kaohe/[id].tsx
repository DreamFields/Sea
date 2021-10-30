import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { useParams } from 'umi';
import { post } from '@/utils/request';

const Index = () => {
  const id = (useParams() as any).id;

  const [data, setData] = useState<any[]>([
    {
      chapter: '章节1',
      ...['1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    },
  ]);

  useEffect(() => {
    post<any>('/v1/teacher/Student_assessment_detail', {
      data: { id: 1 },
    }).then((res) => {
      console.log('Student_assessment_detail', res);
      const d: any[] = [];
      for (let i = 1; i <= 9; i++) {
        const c = res[`chapter${i}`];
        console.log('c', c, i);

        const o: any = {
          chapter: `章节${i}`,
        };

        for (let j = 1; j <= 9; j++) {
          const doo = c[`difficult${j}`];
          o[j - 1] = `${doo.right} / ${doo.num}`;
        }

        d.push(o);
      }
      setData(d);
    });
  }, []);

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
