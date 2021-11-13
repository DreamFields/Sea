import React from 'react';
import { Table, Button } from 'antd';

const columns = [
  {
    title: '题型',
    dataIndex: 'type',
  },
  {
    title: '题干',
    dataIndex: 'content',
  },
];

const data: any[] = [
  {
    key: '1',
    type: 'a',
    content: '1 + 1',
  },
  {
    key: '2',
    type: 'b',
    content: '2 + 2',
  },
  {
    key: '3',
    type: 'c',
    content: '5 + 5',
  },
];

const rowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      'selectedRows: ',
      selectedRows,
    );
  },
  getCheckboxProps: (record: any) => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};

const Index = () => {
  return (
    <div>
      <Table
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
      />

      <Button
        onClick={() => {
          console.log('submit');
        }}
      >
        提交
      </Button>
    </div>
  );
};

export default Index;
