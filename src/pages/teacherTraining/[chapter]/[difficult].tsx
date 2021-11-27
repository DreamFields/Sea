import { post } from '@/utils/request';
import { Table, Button, Space } from 'antd';
import React, { useEffect, useState, useCallback, useRef } from 'react';
//import { HTML5Backend } from 'react-dnd-html5-backend';
import AddQuestion from '../addQuestion';
import UpdateQuestion from '../updateQuestion';
import { useParams } from 'umi';
//import { DndProvider, useDrag, useDrop } from 'react-dnd';
import style from './style.less';

import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';
import { MenuOutlined } from '@ant-design/icons';
import { arrayMoveImmutable } from 'array-move';

const Component = (props: any) => {
  const { chapter, difficult } = useParams() as any;
  console.log('question list detail router param', { chapter, difficult });

  const [dataSource, setDataSource] = useState([]);
  const [state, setState] = useState(0);
  const [updateQuestionId, setUpdateQuestionId] = useState(undefined);

  const fetchQuestionList = () => {
    post<any>('/v1/teacher/question_list', {
      data: {
        chapter: +chapter,
        difficult: +difficult,
      },
    }).then((res) => {
      setDataSource(res);
    });
  };

  useEffect(() => {
    fetchQuestionList();
  }, [state, chapter, difficult]);

  const columns = [
    {
      title: 'Sort',
      dataIndex: 'index',
      width: 30,
      className: 'drag-visible',
      render: () => <DragHandle />,
    },
    {
      title: '题干',
      dataIndex: ['question_info_text_content', 'question_info'],
      key: 'content',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
    },
    /*{
      title: '难度',
      dataIndex: 'difficult',
      key: 'difficult',
    },*/
    {
      title: '用户名',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: '查看题目',
      key: 'actions',
      render(_, data: any) {
        return (
          <Space size="middle">
            <Button
              onClick={() => {
                setState(2);
                setUpdateQuestionId(data.id);
              }}
            >
              详情
            </Button>
            <Button
              onClick={() => {
                if (confirm('是否要删除这个题目？')) {
                  post<any>('/v1/teacher/delete_question', {
                    data: { id: data.id },
                  }).then((res) => {
                    console.log('delete question response', res);
                    fetchQuestionList();
                  });
                }
              }}
            >
              删除题目
            </Button>
          </Space>
        );
      },
    },
  ];

  const DragHandle = SortableHandle(() => (
    <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />
  ));
  const SortableItem = SortableElement((props) => <tr {...props} />);
  const SortableContain = SortableContainer((props) => <tbody {...props} />);

  class SortableTable extends React.Component {
    state = {
      data: dataSource,
    };

    onSortEnd = ({ oldIndex, newIndex }) => {
      const { data } = this.state;
      console.log('Unsorted items: ', data);
      if (oldIndex !== newIndex) {
        const newData = arrayMoveImmutable(
          [].concat(data),
          oldIndex,
          newIndex,
        ).filter((el) => !!el);

        this.setState({ data: newData });
        //console.log('Sorted items: ', oldIndex, newIndex);

        if (oldIndex < newIndex) {
          let list_io = [];
          for (let i = oldIndex; i <= newIndex; i++) {
            list_io.push(data[i]['item_order']);
          }
        }

        let id1 = data[oldIndex]['id'];
        let id2 = data[newIndex]['id'];
        let io1 = data[oldIndex]['item_order'];
        let io2 = data[newIndex]['item_order'];
        post<any>('/v1/teacher/re_order', {
          data: {
            list: [
              { id: id1, item_order: io1 },
              { id: id2, item_order: io2 },
            ],
          },
        }).then((res) => {
          console.log('Sorted items: ', newData);
          console.log(id1, io1, id2, io2);
        });
        fetchQuestionList();
      }
    };

    DraggableContainer = (props) => (
      <SortableContain
        useDragHandle
        disableAutoscroll
        helperClass="row-dragging"
        onSortEnd={this.onSortEnd}
        {...props}
      />
    );

    DraggableBodyRow = ({ className, style, ...restProps }) => {
      const { data } = this.state;
      // function findIndex base on Table rowKey props and should always be a right array index
      const index = data.findIndex(
        (x) => x['item_order'] === restProps['data-row-key'],
      ); // 遍历每一个下标，最后条件一致的时候就返回index
      return <SortableItem index={index} {...restProps} />;
    };

    render() {
      const { data } = this.state;

      return (
        <Table
          pagination={false}
          dataSource={data}
          columns={columns}
          rowKey="item_order"
          components={{
            body: {
              wrapper: this.DraggableContainer,
              row: this.DraggableBodyRow,
            },
          }}
        />
      );
    }
  }

  /*<Table
              dataSource={dataSource}
              columns={columns}
              pagination={{
                pageSize: 100,
                hideOnSinglePage: true,
              }} 
            /> */

  return (
    <div>
      {state === 0 && (
        <>
          <Button onClick={() => setState(1)}>添加题目</Button>
          <SortableTable />
        </>
      )}

      {state > 0 && <Button onClick={() => setState(0)}>返回题目列表</Button>}

      {state === 1 && (
        <AddQuestion
          chapter={chapter}
          difficult={difficult}
          onDone={() => setState(0)}
        />
      )}
      {state === 2 && (
        <UpdateQuestion onDone={() => setState(0)} id={updateQuestionId} />
      )}
    </div>
  );
};

export default Component;
