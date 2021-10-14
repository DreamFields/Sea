import { post } from '@/utils/request';
import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import style from './style.less';
import AddKnowledge from './addKnowledge';

const Component = (props: any) => {
  const [dataSource, setDataSource] = useState([]);
  const [state, setState] = useState(0);

  useEffect(() => {
    post<any>('/v1/teacher/knowledge_list').then((res) => {
      console.log('/v1/teacher/knowledge_list res', res);
      setDataSource(res.sort(($1: any, $2: any) => $1.id - $2.id));
    });
  }, [state]);

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

  return (
    <div>
      {state === 0 && (
        <>
          <Button onClick={() => setState(1)}>添加知识点</Button>
          <Table dataSource={dataSource} columns={columns} />
        </>
      )}
      {state > 0 && <Button onClick={() => setState(0)}>返回知识点列表</Button>}

      {state === 1 && <AddKnowledge onDone={() => setState(0)} />}
    </div>
  );
};

export default Component;
