/* eslint-disable react/display-name */
import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Table, Form, Select } from 'antd';

const { Option } = Select;

const columns = [
  {
    title: '序号',
    key: 'index',
    render: (text, record, index) => <span>{index + 1}</span>,
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '评级',
    key: 'address',
    render: () => <>无</>,
  },
];

const Index = (props) => {
  const { sound_list } = props;
  const [selectedRowKeys, setselectedRowKeys] = useState([]);
  const [form] = Form.useForm();

  const onSelectChange = (e) => {
    console.log(e);
    setselectedRowKeys(e);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <>
      <div style={{ display: 'flex', marginTop: '1rem' }}>
        <Form
          onFinish={(values) => {
            console.log(values);
          }}
          form={form}
        >
          <Form.Item name="mode" label="批量自动检测" style={{ width: 400 }}>
            <Select placeholder="选择模式">
              <Option value="1">模式1</Option>
              <Option value="2">模式2</Option>
              <Option value="3">模式3</Option>
              <Option value="4">模式4</Option>
            </Select>
          </Form.Item>
        </Form>
        <Button
          type="primary"
          style={{ marginLeft: '1rem' }}
          onClick={() => {
            form.submit();
          }}
        >
          检测
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={sound_list?.map((x) => {
          let y = x;
          y.key = x.id;
          return y;
        })}
        rowSelection={rowSelection}
      />
    </>
  );
};

const mapStateToProps = ({ loading, soundList }) => {
  // console.log(loading)
  return {
    soundListLoading: loading.effects['soundList/fetchSoundList'],
    sound_list: soundList.sound_list,
  };
};

export default connect(mapStateToProps)(Index);
