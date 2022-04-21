/*
 * @Author: Meng Tian
 * @Date: 2021-11-05 10:05:40
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
    title: '开始时间',
    dataIndex: 'start_time',
    key: 'start_time',
  },
  {
    title: '截止时间',
    dataIndex: 'end_time',
    key: 'end_time',
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <a
          onClick={() => {
            history.push(`/studentTraining/paper/${record.id}`);
          }}
        >
          参与
        </a>
      </Space>
    ),
  },
];
const PaperCanDo = (props) => {
  const { paperCanDoList, dispatch } = props;
  useEffect(() => {
    dispatch({
      type: 'listenTraining/getPaperCanDo',
    });
  }, []);
  useEffect(() => {
    console.log('paperCanDoList', paperCanDoList);
  }, [paperCanDoList]);
  return <Table columns={columns} dataSource={paperCanDoList} />;
};

const mapStateToProps = ({ listenTraining }) => {
  return {
    paperCanDoList: listenTraining.paperCanDoList,
  };
};

export default connect(mapStateToProps)(PaperCanDo);
