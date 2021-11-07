import { post } from '@/utils/request';
import React, { useEffect, useState } from 'react';
import { Table, Button, Space } from 'antd';
import style from './style.less';

import AddKnowledge from './addKnowledge';

const Component = (props: any) => {
  const [dataSource, setDataSource] = useState([]);
  const [state, setState] = useState(0);

  const fetchKnowledgeList = () => {
    post<any>('/v1/teacher/knowledge_list').then((res) => {
      console.log('/v1/teacher/knowledge_list res', res);

      setDataSource(
        res
          .map((r) => ({ ...r, key: r.id }))
          .sort(($1: any, $2: any) => $1.id - $2.id),
      );
    });
  };
  useEffect(() => {
    fetchKnowledgeList();
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
    {
      title: '删除',
      key: 'actions',
      render(_, data: any) {
        return (
          <Space size="middle">
            <Button
              onClick={() => {
                if (confirm('是否要删除这个知识点？')) {
                  post<any>('/v1/teacher/delete_knowledge', {
                    data: { id: data.id },
                  }).then((res) => {
                    if (res instanceof Array && res.length === 0) {
                      console.log('delete knowledge response', res);
                      fetchKnowledgeList();
                    } else {
                      alert(
                        '知识点删除失败，因为知识点被以下题目占用了' +
                          res
                            .map(
                              (t) => t.question_info ?? '<空标题> 编号' + t.id,
                            )
                            .join(','),
                      );
                    }
                  });
                }
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
