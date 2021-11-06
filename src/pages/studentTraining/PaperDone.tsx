/*
 * @Author: Meng Tian
 * @Date: 2021-11-05 10:00:03
 * @Description: Do not edit
 */
import React, { useEffect } from 'react';
import {
  Row,
  Col,
  Menu,
  Checkbox,
  Radio,
  Tag,
  TagProps,
  Image,
  Button,
  message,
  Space,
  Table,
} from 'antd';
import { history } from 'umi';
import { connect } from '@@/plugin-dva/exports';

const columns = [
  {
    title: '试卷名称',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: '考试时间',
    dataIndex: 'start_time',
    key: 'start_time',
  },
  {
    title: '我的分数',
    dataIndex: 'score',
    key: 'score',
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <a
          onClick={() => {
            history.push(`/studentTraining/paperDone/${record.id}`);
          }}
        >
          查看
        </a>
      </Space>
    ),
  },
];

const PaperDone = (props) => {
  const { paperDoneList, dispatch } = props;
  useEffect(() => {
    dispatch({
      type: 'listenTraining/getPaperDone',
    });
  }, []);
  useEffect(() => {
    console.log('paperDoneList', paperDoneList);
  }, [paperDoneList]);
  return <Table columns={columns} dataSource={paperDoneList} />;
};

const mapStateToProps = ({ listenTraining }) => {
  return {
    paperDoneList: listenTraining.paperDoneList,
  };
};

export default connect(mapStateToProps)(PaperDone);
