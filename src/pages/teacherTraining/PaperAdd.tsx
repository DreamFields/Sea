import React, { useState, useEffect } from 'react';
import style from './style.less';
import {
  Input,
  Button,
  Form,
  Table,
  Space,
  Divider,
  Select,
  Typography,
  DatePicker,
  message,
} from 'antd';
import { post } from '@/utils/request';

const Option = Select.Option;
const { Text } = Typography;
const { RangePicker } = DatePicker;
const options = [
  {
    label: 'Light',
    value: 'light',
    children: new Array(20)
      .fill(null)
      .map((_, index) => ({ label: `Number ${index}`, value: index })),
  },
  {
    label: 'Bamboo',
    value: 'bamboo',
    children: [
      {
        label: 'Little',
        value: 'little',
        children: [
          {
            label: 'Toy Fish',
            value: 'fish',
          },
          {
            label: 'Toy Cards',
            value: 'cards',
          },
          {
            label: 'Toy Bird',
            value: 'bird',
          },
        ],
      },
    ],
  },
];

function onChange(value) {
  console.log(value);
}

const { TextArea } = Input;

const Index = () => {
  const [data, setData] = useState({
    name: '',
    startTime: '',
    endTime: '',
  });
  const [chapter, setChapter] = useState(1);
  const [difficult, setDifficult] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState<any[]>([]);

  useEffect(() => {
    post<any>('/v1/teacher/question_exam_list', {
      data: { difficult, chapter },
    }).then((list) => {
      console.log(list);
      setQuestions(
        list.map((quesiton) => ({
          id: quesiton.id,
          key: quesiton.id,
          content: quesiton?.question_info_text_content?.question_info,
        })),
      );
    });
  }, [difficult, chapter]);

  const selectedColumns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
    },
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
              setSelectedQuestions((questions) =>
                questions.filter((q) => q.id !== data.id),
              );
            }}
          >
            删除题目
          </Button>
        </Space>
      ),
    },
  ];

  const allColumns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
    },
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
              setSelectedQuestions((questions) => {
                return questions.find((q) => q.id === data.id)
                  ? questions
                  : [...questions, data];
              });
            }}
          >
            添加题目
          </Button>
        </Space>
      ),
    },
  ];

  const handleAddQuestion = () => {};

  return (
    <div>
      <Form labelCol={{ span: 2 }} wrapperCol={{ span: 16 }} autoComplete="off">
        <Input
          placeholder="名称"
          onChange={(e) =>
            setData((data) => ({ ...data, name: e.target.value }))
          }
        />
        <Space direction="vertical" size={12}>
          <RangePicker
            showTime
            onChange={(range) => {
              setData((data) => {
                const [startTime, endTime] =
                  range?.map(
                    (moment) => moment?.format('YYYY-MM-DD hh:mm:ss') ?? '',
                  ) ?? [];
                return { ...data, startTime, endTime };
              });
            }}
          />
        </Space>
        {/* <Divider />
        <Button onClick={handleAddQuestion}>新增题目</Button>
        <Divider /> */}
        <Space direction="horizontal" size={12}>
          <Text>章节</Text>
          <Select defaultValue={1} style={{ width: 120 }} onChange={setChapter}>
            {Array(10)
              .fill(null)
              .map((_, idx) => (
                <Option key={`chapter-${idx + 1}`} value={idx + 1}>
                  {idx + 1}
                </Option>
              ))}
          </Select>
        </Space>
        <Space direction="horizontal" size={12}>
          <Text>难度</Text>
          <Select
            defaultValue={1}
            style={{ width: 120 }}
            onChange={setDifficult}
          >
            {Array(10)
              .fill(null)
              .map((_, idx) => (
                <Option key={`chapter-${idx + 1}`} value={idx + 1}>
                  {idx + 1}
                </Option>
              ))}
          </Select>
        </Space>

        <h3>题目列表</h3>
        <Table columns={allColumns} dataSource={questions} />
        <Divider />
        <h3>已增加题目</h3>
        <Table columns={selectedColumns} dataSource={selectedQuestions} />
        <Divider />
        <Button
          onClick={() => {
            console.log('submit page', data);
            const frame_text_content = Object.fromEntries(
              selectedQuestions.map((q, idx) => [`${idx + 1}`, q.id]),
            );

            post<any>(`/v1/teacher/add_paper`, {
              data: {
                frame_text_content,
                name: data.name,
                start_time: data.startTime,
                end_time: data.endTime,
              },
            }).then(message.info('success!'));
          }}
        >
          提交
        </Button>
      </Form>
    </div>
  );
};

export default Index;
