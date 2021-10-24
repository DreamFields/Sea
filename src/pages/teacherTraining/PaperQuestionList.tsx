import React from 'react';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';
import { Table, Button, Space } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { arrayMoveImmutable } from 'array-move';

const DragHandle = SortableHandle(() => (
  <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />
));

const columns = [
  {
    title: '顺序',
    dataIndex: 'sort',
    width: 30,
    className: 'drag-visible',
    render: () => <DragHandle />,
  },
  {
    title: '题干',
    dataIndex: 'content',
    className: 'drag-visible',
  },
  {
    title: '分数',
    dataIndex: 'score',
  },
  {
    title: '单/多',
    dataIndex: 'selection',
  },
  {
    title: '考/训',
    dataIndex: 'test',
  },
  {
    title: '操作',
    dataIndex: 'action',
    render(_, data: any) {
      return (
        <Space size="middle">
          <Button
            onClick={() => {
              console.log('edit', data);
            }}
          >
            编辑
          </Button>

          <Button
            onClick={() => {
              console.log('copy', data);
            }}
          >
            复制
          </Button>

          <Button
            onClick={() => {
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

const data = [
  {
    index: '1',
    content: '1 + 1',
    score: 1,
    selection: '单',
    test: '考',
  },
  {
    index: '2',
    content: '2 + 2',
    score: 2,
    selection: '单',
    test: '考',
  },
  {
    index: '3',
    content: '4 + 4',
    score: 3,
    selection: '单',
    test: '考',
  },
];

const SortableItem = SortableElement((props) => <tr {...props} />);
const SortableContainerInstance = SortableContainer((props) => (
  <tbody {...props} />
));

class Index extends React.Component {
  state = {
    dataSource: data,
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { dataSource } = this.state;

    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(
        [...dataSource],
        oldIndex,
        newIndex,
      ).filter((el) => !!el);
      console.log('Sorted items: ', newData);
      this.setState({ dataSource: newData });
    }
  };

  DraggableContainer = (props) => (
    <SortableContainerInstance
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={this.onSortEnd}
      {...props}
    />
  );

  DraggableBodyRow = ({ className, style, ...restProps }) => {
    const { dataSource } = this.state;
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex(
      (x) => x.index === restProps['data-row-key'],
    );
    return <SortableItem index={index} {...restProps} />;
  };

  render() {
    const { dataSource } = this.state;

    return (
      <Table
        pagination={false}
        dataSource={dataSource}
        columns={columns}
        rowKey="index"
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

export default Index;
