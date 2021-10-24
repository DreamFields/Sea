import React, { useState } from 'react';
import style from './style.less';
import { Input, Button, Form, Table, Space, Divider } from 'antd';

const { TextArea } = Input;

const Index = () => {
  const [data, setData] = useState({
    name: '',
    startTime: '',
    endTime: '',

    questions: [],
  });

  const columns = [
    {
      title: '题干',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: '操作',
      key: 'action',
      render: (data) => (
        <Space size="middle">
          <Button
            onClick={() => {
              console.log('delete question', data);
            }}
          >
            删除题目
          </Button>
        </Space>
      ),
    },
  ];

  const handleAddQuestion = () => {};

  return (
    <div>
      <Form labelCol={{ span: 2 }} wrapperCol={{ span: 16 }} autoComplete="off">
        <Form.Item label="试卷题目" name="name">
          <TextArea
            value={data.name}
            defaultValue={data.name}
            onChange={(e) => {
              data.name = e.target.value;
              setData({
                ...data,
              });
            }}
            placeholder="试卷题目"
          ></TextArea>
        </Form.Item>

        <Form.Item label="开始时间" name="start_time">
          <TextArea
            value={data.startTime}
            defaultValue={data.startTime}
            onChange={(e) => {
              data.startTime = e.target.value;
              setData({
                ...data,
              });
            }}
            placeholder="开始时间"
          ></TextArea>
        </Form.Item>

        <Form.Item label="结束时间" name="end_time">
          <TextArea
            value={data.endTime}
            defaultValue={data.endTime}
            onChange={(e) => {
              data.endTime = e.target.value;
              setData({
                ...data,
              });
            }}
            placeholder="结束时间"
          ></TextArea>
        </Form.Item>

        <Divider />
        <Button onClick={handleAddQuestion}>新增题目</Button>
        <Divider />

        <h3>已增加题目</h3>
        <Table columns={columns} dataSource={data.questions} />
        <Divider />

        <Button
          onClick={() => {
            console.log('submit page', data);
          }}
        >
          提交
        </Button>
      </Form>
    </div>
  );
};

export default Index;
