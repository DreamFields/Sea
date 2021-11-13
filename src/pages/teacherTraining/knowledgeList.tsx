import { post } from '@/utils/request';
import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal } from 'antd';
import style from './style.less';

import AddKnowledge from './addKnowledge';

const Component = (props: any) => {
  const [dataSource, setDataSource] = useState([]);
  const [state, setState] = useState(0);

  const [visible, setVisible] = React.useState(false);
  const [modalData, setModalData] = React.useState<any[]>([]);

  const handleOk = () => {
    setVisible(false);
  };

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
            <Button
              onClick={() => {
                post<any>('/v1/teacher/knowledge_in_use', {
                  data: { id: data.id },
                }).then((data) => {
                  console.log('knowledge_in_use', data);
                  setModalData(data);
                  setVisible(true);
                });
              }}
            >
              被题目占用情况
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
      <Modal
        title="知识点占用情况"
        visible={visible}
        onOk={handleOk}
        onCancel={handleOk}
      >
        {modalData.length === 0 && <div>该知识点无题目占用</div>}
        {modalData.length > 0 &&
          modalData.map((t, idx) => {
            return (
              <div key={idx}>
                [{t.id}] {t.question_info.question_info}
              </div>
            );
          })}
      </Modal>
    </div>
  );
};

export default Component;
