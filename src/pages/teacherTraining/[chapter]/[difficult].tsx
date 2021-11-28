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
  //console.log('question list detail router param', { chapter, difficult });

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
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'item_order',
      dataIndex: 'item_order',
      key: 'item_order',
    },
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
      const { data: dataUnsort } = this.state;
      console.log('Unsorted items: ', dataUnsort);
      if (oldIndex !== newIndex) {
        const newData = arrayMoveImmutable(
          [].concat(dataUnsort),
          oldIndex,
          newIndex,
        ).filter((el) => !!el);

        console.log('newData: ', newData);
        //this.setState({ data: newData });
        console.log('Index: ', oldIndex, newIndex);

        let listId = [];
        let listIo = [];
        let listIoSort = [];

        const dataSort = newData;

        if (oldIndex < newIndex) {
          listId.push(dataUnsort[oldIndex]['id']);
          listIo.push(dataUnsort[newIndex]['item_order']);
          listIoSort.push(dataUnsort[oldIndex]['item_order']);
          for (let i = oldIndex; i < newIndex; i++) {
            listId.push(dataUnsort[i + 1]['id']);
            listIo.push(dataUnsort[i]['item_order']);
            listIoSort.push(dataUnsort[i + 1]['item_order']);
          }
          for (let i = oldIndex; i <= newIndex; i++) {
            dataSort[i]['item_order'] = listIoSort[i - oldIndex];
          }
        } else {
          for (let i = newIndex; i < oldIndex; i++) {
            listId.push(dataUnsort[i]['id']);
            listIo.push(dataUnsort[i + 1]['item_order']);
            listIoSort.push(dataUnsort[i]['item_order']);
          }
          listId.push(dataUnsort[oldIndex]['id']);
          listIo.push(dataUnsort[newIndex]['item_order']);
          listIoSort.push(dataUnsort[oldIndex]['item_order']);
          for (let i = newIndex; i <= oldIndex; i++) {
            dataSort[i]['item_order'] = listIoSort[i - newIndex];
          }
        }

        console.log('dataSort: ', dataSort);
        this.setState({ data: dataSort });

        console.log('id', listId);
        console.log('io', listIo);
        let listData: any = [];

        for (let i = 0; i < listId.length; i++) {
          listData.push({ id: listId[i], item_order: listIo[i] });
        }

        console.log('data', listData);
        post<any>('/v1/teacher/re_order', {
          data: {
            list: listData,
          },
        }).then((res) => {});
        //fetchQuestionList();
        //console.log(dataSortEnd);
        //this.setState({ data : dataSortEnd });
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
